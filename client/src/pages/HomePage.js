import { useEffect } from "react"
import { useState } from "react"

export default function HomePage() {

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  }

  const handleSubmission = () => {
        const CHUNK_SIZE = 5000;

        const totalChunks = selectedFile.files[0] / CHUNK_SIZE;

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(selectedFile.files[0]);

        fileReader.onload = async (event) => {

            // start streaming file to backend
            const CHUNK_SIZE = 5000;
            const content = event.target.result
            const totalChunks = event.target.result.files[0] / CHUNK_SIZE;

            const fileName = Math.random().toString(36).slice(-6) + selectedFile.files[0].name;

            for (let chunk = 0;  chunk < totalChunks + 1; chunk++) {
                let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE);
                await fetch('/api/upload?fileName=' + fileName, {
                        'method': 'POST',
                    'headers': {
                        'content-type': "application/octet-stream",
                        'content-length': CHUNK.length,
                    },
                    'body': CHUNK
                })
           }
            console.log("Complete File Read Successfully")
        }
  }
  const handleUpload = (e) => {
        const fileReader = new FileReader();

  }

  return (
    <div>
        <h1> HomePage </h1>
        
        <input type = "file" onChange = {changeHandler} />
        <div>
           <button onClick={handleUpload}>"Upload"</button>
        </div>
    </div>

  )
}

