import React from 'react';
import axios from 'axios';
import Title from '../generic/title';

import './editImages.css';

import {
  Card,
  Button,
  Form,
  Image,
  Alert
} from 'react-bootstrap';

const UPSTREAM_URI = `${process.env.UPSTREAM_URI}`;

class EditImages extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();

    this.state = {
      images: [],
      badRequestError: ''
    };
  }

  componentDidMount() {
    this.onGetImages();
  }

  onGetImages = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/user-images`);

      this.setState({ images: res.data.images });
    } catch (e) { console.log(e.message || e); }
  }

  onUploadImages = async () => {
    this.setState({ badRequestError: '' });

    event.preventDefault();

    const images = this.fileInput.current.files;

    if (images.length <= 0) {
      alert('Please select at least one image to upload');
      return;
    }

    if (images.length > 5) {
      alert('You cannot upload more than 5 images');
      return;
    }

    let formData = new FormData();

    for (let image of images) {
      const mimeType = image.type.split('/');
      const validSubtypes = ['jpeg', 'png', 'bmp'];

      if (mimeType[0] !== 'image' || !validSubtypes.includes(mimeType[1])) {
        alert('You can only upload images of type: ' + validSubtypes.join(', '));
        return;
      }

      formData.append('images', image);
    }

    try {
      await axios.post(`${UPSTREAM_URI}/user-images`, formData);
      await this.onGetImages();
    } catch (e) {
      if (e.response.status === 400) {
        this.setState({ badRequestError: e.response.data });
      } else {
        console.log(e.message || e);
      }
    }
  }

  onDeleteImage = async (imageId) => {
    try {
      await axios.delete(`${UPSTREAM_URI}/user-image?imageId=${imageId}`);

      await this.onGetImages();
    } catch (e) {
      console.log(e.message || e);
    }
  }

  render() {
    const {
      images,
      badRequestError
    } = this.state;

    return (
      <div>
        <Title title='Edit Images' />
        <Card className='mb-2'>
          <Card.Header>Images</Card.Header>
          <Card.Body>
            {
              !!badRequestError && (
                <Alert variant='danger'>{badRequestError}</Alert>
              )
            }
            {
              images.map((image, index) => (
                <React.Fragment key={index}>
                  <Image
                    thumbnail
                    src={`${UPSTREAM_URI}/${image.path}`}
                    width='200px'
                    height='200px'
                    className='edit-images-image m-1'
                    onClick={() => this.onDeleteImage(image.id)}
                  />
                </React.Fragment>
              ))
            }
          </Card.Body>
        </Card>

        <Form
          className='mb-2'
          onSubmit={this.onUploadImages}
        >
          <Form.File
            label='Choose an image'
            custom
            ref={this.fileInput}
            accept='image/*'
            multiple
            name='images'
          />
        </Form>

        <Button
          size='sm'
          onClick={this.onUploadImages}
        >
          Upload
        </Button>
      </div>
    );
  }
}

export default EditImages;