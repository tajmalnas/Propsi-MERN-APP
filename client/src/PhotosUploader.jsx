/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";

const PhotosUploader = ({addedPhotos,onChange}) => {

    const [photoLink,setPhotoLink] = useState('');

    const addPhotoByLink = async (e) => {
        e.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link',{link:photoLink})   
        onChange(prev=>{
            return [...prev,filename];
        })
        setPhotoLink('');
    }

    const uploadPhoto =(e)=>{
        e.preventDefault();
        const files = e.target.files;
        const data = new FormData();
        for(let i=0;i<files.length;i++){
            data.append('photos',files[i])
        }
        axios.post('/upload',data,{
            headers:{'Content-type':'multipart/form-data'}
        }).then(res => {
            const {data:filenames} = res;
            let finalFiles = [];
            for(let i=0;i<filenames.length;i++){
                finalFiles.push(filenames[i].slice(8,filenames[i].length));
            }
            onChange(prev=>{
                return [...prev,...finalFiles];
            })
        })
        console.log(files);
    }

    const removeImage = (link) => {
        console.log(link);
        onChange([...addedPhotos.filter(photo=>photo!==link)])
    }

  return (
    <div>
        <div className="flex gap-2">
              <input
                  type="text" placeholder="Photo URL...."
                  value={photoLink}
                  onChange={(e)=>setPhotoLink(e.target.value)}
              />
              <button onClick={addPhotoByLink} className="bg-gray-200 grow rounded-full px-4 py-2" >Add&nbsp;Photo</button>
         </div>
          <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length>0 && addedPhotos.map(link=>(
                  <div key={link} className="h-32 flex relative">
                      <img className="rounded-2xl w-full object-cover" src={'https://propsi-mern-backend.onrender.com/uploads/'+link} alt="" ></img>
                      <div className="absolute bottom-1 right-1 p-1 bg-black/30 rounded-2xl text-white cursor-pointer" onClick={()=>removeImage(link)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </div>
                  </div>
              ))}
              <label className="border-solid border-2 border-primary/50 bg-transparent font-bold rounded-2xl cursor-pointer p-8 text-primary/80">
                  <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                  Upload From Device
              </label>
          </div>
    </div>
  )
}

export default PhotosUploader