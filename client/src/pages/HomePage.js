import { useEffect } from "react"
import { useState } from "react"
import AWS from 'aws-sdk';
import {BasicPitch} from '@spotify/basic-pitch'
import {outputToNotesPoly} from '@spotify/basic-pitch'
import { addPitchBendsToNoteEvents } from "@spotify/basic-pitch";
import { noteFramesToTime } from "@spotify/basic-pitch";
import * as tf from '@tensorflow/tfjs'
import modelJson from '../models/model.json'
import './HomePage.css'

export default function HomePage() {

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  }


  const handleSubmission = () => {

        // AWS multipart file upload on client side
        // see https://blog.filestack.com/tutorials/amazon-s3-multipart-uploads-javascript/
        const CHUNK_SIZE = 5000;

        const totalChunks = selectedFile / CHUNK_SIZE;

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(selectedFile);

        fileReader.onload = async (event) => {

            const fileName = Math.random().toString(36).slice(-6) + selectedFile.name;

            const s3Client = new AWS.S3({
                region: "us-east-2",
                accessKeyId: `${process.env.REACT_APP_AWS_ACCESS_KEY_ID}`,
                secretAccessKey: `${process.env.REACT_APP_AWS_SECRET_ACCESS_KEY}`,
                Bucket: `${process.env.REACT_APP_AWS_BUCKET_NAME}`
            })

            let multipartCreateResult = await s3Client.createMultipartUpload({
                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                ACL: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                Key:fileName,
                ACL: "public-read",
                ContentType: "audio/wav",
                StorageClass: "STANDARD"
            }).promise()

            console.log(s3Client.config);

            // start streaming file to backend
            const content = event.target.result
            let uploadPartResults = []
  
            let CHUNK = content;

            let uploadResult = await s3Client.uploadPart({
                Body: CHUNK,
                Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
                ContentLength: event.target.result.byteLength,
                Key: fileName,
                PartNumber: 1,
                UploadId: multipartCreateResult.UploadId,
            }).promise()
            
            console.log(uploadResult)

            uploadPartResults.push({
                PartNumber:1,
                ETag: uploadResult.ETag
            })
           
           
           let completeUploadResponse = await s3Client.completeMultipartUpload({
            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
            Key: fileName,
            MultipartUpload: {
                Parts: uploadPartResults
            },
            UploadId: multipartCreateResult.UploadId
        }).promise()


            const awsUrl = completeUploadResponse.Location

            // const reponse = await fetch('api/process' ,{
            //        method: 'POST',
            //        headers: {
            //             "Content-Type": 'application/json'
            //        },
            //        body: JSON.stringify({
            //         "awsUrl": `${completeUploadResponse.Location}`
            //     })
            // })  

            let frames = [];
            let onsets = [];
            let contours = [];
            let pct;

            const model = await tf.loadGraphModel("https://generative-music-project-audio-files.s3.us-east-2.amazonaws.com/model.json")

            const audioCtx = new AudioContext({sampleRate: 22050});
            let audioBuffer = undefined;

            var audioFile = fetch(awsUrl).then(response => response.arrayBuffer()).then(buffer => audioCtx.decodeAudioData(buffer)).then(async buffer => {
                audioBuffer = buffer;
                const basicPitch = new BasicPitch();
                await basicPitch.evaluateModel(model,
                  audioBuffer,
                  (f, o, c) => {
                    frames.push(...f);
                    onsets.push(...o);
                    contours.push(...c);
                  },
                  (p) => {
                    pct = p; 
                  },
                );
                
                const notes = noteFramesToTime(
                  addPitchBendsToNoteEvents(
                    contours,
                    outputToNotesPoly(frames, onsets, 0.25, 0.25, 5),
                  ),
                );

                console.log(notes)

            });
                      

        }   
  }

  return (
    <div>
        <section class = "hero" >
            <div class = "hero-body">
                <p class = "title">
                    Vibes ∞ 
                </p>
                <p class = "subtitle" >
                    Ambient Soundscapes from your favorite tracks 🎶 
                </p>
            </div>
        </section>
        
        <input type = "file" onChange = {changeHandler} class = "fas fa-upload"/>
        <div>
           <button onClick={handleSubmission} class = "button"> Upload </button>
        </div>
    </div>

  )
}

