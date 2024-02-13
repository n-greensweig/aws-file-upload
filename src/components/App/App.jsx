import { useState, useEffect } from 'react';
import { readAndCompressImage } from 'browser-image-resizer';

import axios from 'axios';

function App () {
  // Selected image file name
  const [fileName, setFileName] = useState('');
  // Selected file type
  const [fileType, setFileType] = useState('');
  // Selected image file
  const [selectedFile, setSelectedFile] = useState();
  // Selected image preview
  const [imagePreview, setImagePreview] = useState();
  // Used to display uploaded images on the page
  const [imageList, setImageList] = useState([]);

  const onFileChange = async (event) => {
    // Access the selected file
    const fileToUpload = event.target.files[0];

    // Resize and compress the image. Remove this if using something other
    // than an image upload.
    const copyFile = new Blob([fileToUpload], { type: fileToUpload.type, name: fileToUpload.name });
    const resizedFile = await readAndCompressImage(copyFile, {
      quality: 1.0,    // 100% quality
      maxHeight: 1000, // max height of the image
    });

    // Limit to specific file types.
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    // Check if the file is one of the allowed types.
    if (acceptedImageTypes.includes(fileToUpload.type)) {
      // Resizing the image removes the name, store it in a separate variable
      setFileName(encodeURIComponent(fileToUpload.name));
      setFileType(encodeURIComponent(fileToUpload.type));
      // Save the resized file
      setSelectedFile(resizedFile);
      // Create a URL that can be used in an img tag for previewing the image
      setImagePreview(URL.createObjectURL(resizedFile));
    } else {
      alert('Please select an image');
    }
  }

  const sendPhotoToServer = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedFile);
    let postUrl = `/api/images?imageName=${fileName}&imageType=${fileType}`;
    axios.post(postUrl, formData).then(response => {
      console.log('Success!');
      alert('Success!');
      clearForm();
      getImages();
    }).catch(error => {
      console.log('error', error);
      alert('Something went wrong');
    })
  }

  const clearForm = () => {
    setFileName('');
    setFileType('');
    setSelectedFile(undefined);
    setImagePreview(undefined);
  }

  const getImages = () => {
    axios.get('/api/images').then(response => {
      setImageList(response.data);
    }).catch(error => {
      console.log('error', error);
      alert('Something went wrong');
    });
  }

  useEffect(() => {
    getImages();
  }, []);
  
  return (
    <div>
      <form onSubmit={sendPhotoToServer}>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
        />
        {
          imagePreview && (
            <>
              <br />
              <br />
              <p>Preview</p>
              <img style={{maxHeight: '100px'}} src={imagePreview} />
            </>
          )
        }
        <br />
        <button type="submit">Submit</button>
      </form>

      <h2>Images</h2>
      {
        imageList.map(image => (
          <div key={image.id}>
            <div>{image.name}</div>
            <div>{image.type}</div>
            <img style={{ maxHeight: '200px' }} src={`api/images/${image.name}`} /> 
          </div>
        ))
      }
    </div>
  );

}

export default App
