import React, { useEffect, useState, useRef } from 'react';
import { api } from '../utils/Utils';
import axios from 'axios';
import SelectFile from './SelectFile';
import { useNavigate } from 'react-router-dom';
import SnackbarWithDecorators from '../utils/SnackbarWithDecorators';

const Poster = () => {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhoneb] = useState();
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const canvasRef = useRef(null);
    const [open, setOpen] = React.useState(false);
    const [xlsxFile, setXlsxFile] = useState(null);
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const navigate = useNavigate();
    
    useEffect(() => {
        const is_logged = localStorage.getItem("poster_is_logged_in");
        if(!is_logged){
            navigate('/');
        }
        console.log(is_logged);
    }, [name, dob, avatar]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (name === "" || dob === "" || avatar === null) {
            setError("All fields are required!");
            setTimeout(() => {
                setError("");
            }, 3000);
        } else {
            setLoading(true);
            api('api/v1', 'post', { name: name, phone:phone , dob: dob, avatar: avatar }, true) // Example API call to save the image
            .then((res) => {
                console.log(res.data);
                setSnackbarProperty(prevState => ({
                    ...prevState,
                    text: "Data added successfully!",
                    color: "success"
                  }));
                setSnackAlert(true);
            })
            .catch((e) => {
                setSnackbarProperty(prevState => ({
                    ...prevState,
                    text: "Error in adding data!",
                    color: "danger"
                  }));
                setSnackAlert(true);
                console.log(e);
            })
            .finally(() => {
                setLoading(false);
            });
        };
    }
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className='flex justify-center h-[100vh] items-center'>
            {
            snackAlert && <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color}  />
            }
            <div className='max:w-[35rem] min:w-[20rem] xl:w-[35rem]'>
                <h1 className='text-4xl font-extrabold text-slate-800 text-center py-8' style={{ fontFamily: '"Dancing Script", cursive' }}>Birthday poster</h1>
                <form className='p-6'>
                    {error !== "" && <p className='text-red-600 text-xs mb-2'>*{error}</p>}
                    {selectedImage && <img className="m-auto rounded-full w-48 h-48 mb-6" src={selectedImage || "/images/blank.jpeg"} alt="Selected Image" />}
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} name='name' type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">DOB</label>
                            <input onChange={(e) => setDob(e.target.value)} name='dob' type="date" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
                        </div>
                    </div>
                        <div>
                            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                            <input placeholder="Your phone number" onChange={(e) => setPhoneb(e.target.value)} value={phone} name='dob' type="number" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                    <div className="mb-6 mt-2">
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidthr="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" onChange={handleImageChange} type="file" className="hidden" />
                            </label>
                        </div>
                    </div>
                    <button onClick={onSubmit} type="submit" className="text-white bg-slate-900 hover:bg-slate-950 focus:ring-slate-950 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    <button onClick={() => setOpen(true)} className='my-2 text-white bg-red-800 hover:bg-red-900 focus:ring-red-900 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Upload</button>
                    {loading && "Loading..."}
                    {open && <SelectFile setIsSubmit={setIsSubmit} loading={loading} setLoading={setLoading} setSnackbarProperty={setSnackbarProperty} snackbarProperty={snackbarProperty} setSnackAlert={setSnackAlert} snackAlert={snackAlert} setXlsxFile={setXlsxFile} xlsxFile={xlsxFile} open={open} setOpen={setOpen} />}
                    {isSubmit && "All data of excel file has been added successfully!" }
                </form>
            </div>
            {/* <div>
                
                <canvas ref={canvasRef} className='shadow-xl mt-12 sm:h-[400px] md:h-[550px] lg:h-[800px] object-contain rounded-2xl' width={600} height={800} />
            </div> */}
        </div>
    );
}

export default Poster;
