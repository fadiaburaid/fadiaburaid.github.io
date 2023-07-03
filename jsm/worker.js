import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.3.0/src/pipelines.js';	

const file = "tos.pcm";
const model = "Xenova/whisper-base.en";

var content="";

(async () => {
	const pipe = await pipeline("automatic-speech-recognition", model);
})()

onmessage = async function(e) {
	let result = await pipe(e.data, {
			chunk_length_s: 30,
			stride_length_s: 5,
			return_timestamps: true});
	for(let {text, timestamp} of result.chunks)
		content += `${text}\n`;
	postMessage(content);
};
