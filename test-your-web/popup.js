/* eslint-disable no-undef */
/* eslint-disable strict */
// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const saveData = document.getElementById('saveData');
const addComment = document.getElementById('addComment');

const handleAPI = (url) => {
	chrome.storage.sync.get(['page_url'], function(result) {
		const comment = document.getElementById('comment').value;
		const bugtype = document.getElementById('bugtype').value;
		const location = document.getElementById('location').value;
		const restData = `comment=${comment}&bugtype=${bugtype}&location=${location}&user_agent=${navigator.platform}&page_url=${result.page_url}`;
		const xhttp = new XMLHttpRequest();
		const actualUrl = `https://script.google.com/macros/s/AKfycbyfjZUcufIImzO9LawcttLOceaNmN4TRqysYIg4EBYEM6h6p4c/exec`;
		xhttp.open('POST', actualUrl, true);
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState === 4 && xhttp.status === 200) {
				alert(JSON.stringify(xhttp.responseText));
			}
		};
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp.send(`screen_shot_url=${url}&${restData}`);
	});
};

const uploadDocument = (file, documentData) =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		const { url, headers } = JSON.parse(documentData);
		if (url) {
			xhr.open('PUT', url);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						resolve(documentData);
					} else {
						reject(console.log('There as an issue uploading the document'));
					}
				}
			};
			Object.keys(headers).forEach((header) => xhr.setRequestHeader(header, headers[header]));
			xhr.send(file);
		} else {
			console.log('Error in Uploading File, Try again!');
		}
	});

const getRequest = (url, params) =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${url}?file_name=${params.file_name}`, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(xhr.responseText);
				} else {
					reject(console.log('There as an issue uploading the document.'));
				}
			}
		};
		xhr.send();
	});

const getSignature = (params) => {
	try {
		const response = getRequest('https://staging-api.cogoport.com/get_media_upload_url', params);
		return response.success ? response.data : response;
	} catch (error) {
		return error;
	}
};

const handleUpload = (name, file) => {
	if (file) {
		getSignature({ file_name: name })
			.then((response) => uploadDocument(file, response))
			.then((res) => {
				const resObj = JSON.parse(res);
				if ((resObj || {}).url) {
					handleAPI(resObj.url.split('?')[0]);
				} else {
					console.log('Error in handle upload');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
};
function dataURLtoFile(dataurl, filename) {
	const arr = dataurl.split(',');
	const mime = arr[0].match(/:(.*?);/)[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}

document.getElementById('heighLight').onclick = function() {
	chrome.storage.local.clear();
	const userWords = document.getElementById('userWords').value.trim();
	chrome.storage.local.get(['words'], function(object) {
		const newWords = object.words || [];
		newWords.push(userWords);
		chrome.storage.local.set({ words: newWords });
	});
	chrome.tabs.executeScript(null, {
		file: 'highlight.js',
	});
};

addComment.onclick = () => {
	chrome.tabs.executeScript(null, {
		file: 'insert-comment.js',
	});
};

saveData.onclick = () => {
	chrome.tabs.executeScript(null, {
		file: 'set-url.js',
	});
	chrome.tabs.captureVisibleTab((url) => {
		// Usage example:
		const file = dataURLtoFile(url, 'screenshot.jpeg');
		handleUpload('screenshot.jpeg', file);
	});
};

document.getElementById('wordSubmit').onclick = function() {
	chrome.tabs.executeScript(null, {
		file: 'content_script.js',
	});
};
