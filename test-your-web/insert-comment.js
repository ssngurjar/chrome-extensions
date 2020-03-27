/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
chrome.storage.sync.set({ total_comments: 1 });

document.onclick = (e) => {
	if (e.target.tagName !== 'TEXTAREA') {
		chrome.storage.sync.get(['total_comments'], function(result) {
			const para = document.createElement('textarea');
			para.setAttribute('id', `comment_${result.total_comments}`);
			para.setAttribute(
				'style',
				`position: absolute; top: ${e.clientY}px;left: ${e.clientX}px;z-index: 2147483647;`,
			);
			document.body.appendChild(para);
			chrome.storage.sync.set({ total_comments: Number(result.total_comments + 1) });
		});
	}
};
