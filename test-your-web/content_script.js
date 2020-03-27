/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const insertCanvas = () => {
	const para = document.createElement('canvas');
	para.setAttribute('id', 'canvas');
	document.body.appendChild(para);
};
insertCanvas();
const el = document.getElementById('canvas');
el.setAttribute(
	'style',
	'position: fixed; top: 0px;left: 0px;z-index: 2147483647;pointer-events: auto;background: transparent; 	width: 100%;height: 100vh;',
);
const ctx = el.getContext('2d');
el.width = window.innerWidth;
el.height = window.innerHeight;
console.log(ctx);
let isDrawing;

el.onmousedown = function(e) {
	isDrawing = true;
	ctx.moveTo(e.clientX, e.clientY);
};
el.onmousemove = function(e) {
	if (isDrawing) {
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();
	}
};
el.onmouseup = function() {
	isDrawing = false;
};
