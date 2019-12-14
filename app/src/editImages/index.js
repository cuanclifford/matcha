import React from 'react';
import axios from 'axios';
import { strict } from 'assert';

class EditImages extends React.Component {
  constructor(props) {
    super(props);

    this.state = { images: [] };
  }

  componentDidMount() {
    this.onGetImages();
  }

  onGetImages = async () => {
    try {
      const res = await axios.get('http://localhost:3001/user-images');

      this.setState({ images: res.data.images });
    } catch (e) { console.log(e.message || e); }
  }

  onUploadImages = async () => {
    const images = this.state.images;

    if (images.length <= 0) {
      console.log('Please select at least one image to upload');
      return;
    }

    if (images.length > 5) {
      console.log('You cannot upload more than 5 images');
      return;
    }

    let formData = new FormData();

    for (let image of this.state.images) {
      const mimeType = image.type.split('/');
      const validSubtypes = ['jpeg', 'png', 'bmp'];

      if (mimeType[0] !== 'image' || !validSubtypes.includes(mimeType[1])) {
        console.log('You can only upload images of type: ' + validSubtypes.join(', '));
        return;
      }

      formData.append('images', image);
    }

    try {
      await axios.post('http://localhost:3001/user-images', formData);
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    const { images } = this.state;

    console.log(images[0]);

    return (
      <div>
        <h1>EditImages Component</h1>
        {
          images.map((image, index) => (
            <React.Fragment key={index} >
              <img src={'data:image/jpeg;base64,' + image.replace('\n', '')} />
              <br />
            </React.Fragment>
          ))
        }

        <input
          type="file"
          accept="image/*"
          multiple
          name="images"
          onChange={(event) => { this.setState({ images: event.target.files }); }}
        />
        <br />

        <button onClick={this.onUploadImages} >
          Upload
        </button>
      </div>
    );
  }
}

export default EditImages;