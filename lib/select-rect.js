"use strict";

var React = require("react");
var _ = require("lodash");
var Mask = require("./mask");
var Handle = require("./handle");
var geometry = require("./geometry");

var SelectRect = module.exports = React.createClass({
	displayName: "SelectRect",

	propTypes: {
		backgroundSrc: React.PropTypes.string.isRequired,
		maskColor: React.PropTypes.string,
		updateSelection: React.PropTypes.func.isRequired,
		imgOnLoad: React.PropTypes.func,
		initialSelection: React.PropTypes.arrayOf(React.PropTypes.number),
		size: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
	},

	render: function render() {
		var style = { position: "relative" };
		return React.createElement(
			"div",
			{
				onMouseUp: this.endDragPan,
				className: "select-rect",
				style: style },
			React.createElement("img", {
				onLoad: this.imgOnLoad,
				src: this.props.backgroundSrc,
				ref: "image" }),
			this.renderMask(this.getTopRect()),
			this.renderMask(this.getLeftRect()),
			this.renderWindow(this.getCenterRect()),
			this.renderMask(this.getRightRect()),
			this.renderMask(this.getBottomRect()),
			this.renderHandles()
		); // TODO: center pan & crosshair
	},

	getDefaultProps: function getDefaultProps() {
		return {
			initialSelection: [0, 0, 100, 100],
			maskColor: "rgba( 0, 0, 0, 0.25 )"
		};
	},

	getInitialState: function getInitialState() {
		return {
			x0: 0,
			y0: 0,
			x1: this.props.size[0],
			y1: this.props.size[1]
		};
	},

	imgOnLoad: function imgOnLoad(event) {
		var img = event.target;
		var scale = img.offsetWidth / img.naturalWidth;

		this.setState({
			x0: 0,
			y0: 0,
			x1: this.props.size[0] * scale,
			y1: this.props.size[1] * scale
		});

		if (this.props.imgOnLoad) {
			this.props.imgOnLoad(img);
		}

		this.props.updateSelection(0, 0, this.props.size[0], this.props.size[1]);
	},

	renderHandles: function renderHandles() {
		return _.range(4).map((function (i) {
			var ix = i % 2;
			var iy = Math.floor(i / 2);

			return React.createElement(Handle, {
				x: ix ? this.state.x1 : this.state.x0,
				y: iy ? this.state.y1 : this.state.y0,
				onMouseDown: this.startDragHandle(ix, iy),
				key: i });
		}).bind(this));
	},

	startDragHandle: function startDragHandle(ix, iy) {
		return (function (event) {
			this.setState({
				dragging: [ix, iy],
				origin: [this.state[!ix ? "x1" : "x0"], this.state[!iy ? "y1" : "y0"]],
				handle: [this.state[ix ? "x1" : "x0"], this.state[iy ? "y1" : "y0"]]
			});

			document.onmousemove = this.dragHandle;
		}).bind(this);
	},

	startPan: function startPan() {
		return (function (event) {
			this.setState({
				panning: true
			});

			document.onmousemove = this.pan;
		}).bind(this);
	},

	endDragPan: function endDragPan() {
		this.setState({
			dragging: null,
			panning: null
		});

		document.onmousemove = null;
	},

	dragHandle: function dragHandle(event) {
		event.preventDefault();
		event.stopPropagation();

		var ix = this.state.dragging[0];
		var iy = this.state.dragging[1];

		var bounds = this.refs.image.getDOMNode().getBoundingClientRect();
		var mx = Math.floor(Math.max(0, event.clientX - bounds.left) - this.state.origin[0]);
		var my = Math.floor(Math.max(0, event.clientY - bounds.top) - this.state.origin[1]);

		var newRect = geometry.constrainScale(geometry.scaleByHandle([[this.state.x0, this.state.y0], [this.state.x1, this.state.y1]], this.props.size, this.state.origin, this.state.handle, [mx, my]), [bounds.width, bounds.height]);

		if (newRect[0][0] < 0 || newRect[0][1] < 0) {
			return;
		}

		var img = React.findDOMNode(this.refs.image);
		var scale = img.width / img.naturalWidth;
		if (newRect[1][0] - newRect[0][0] < this.props.size[0] * scale || newRect[1][1] - newRect[0][1] < this.props.size[1] * scale) {
			return;
		}

		this.setState({
			x0: newRect[0][0],
			y0: newRect[0][1],
			x1: newRect[1][0],
			y1: newRect[1][1]
		});

		var scaled = this.realScale(this.state.x0, this.state.y0, this.state.x1, this.state.y1);
		this.props.updateSelection(scaled[0], scaled[1], scaled[2], scaled[3]);
	},

	realScale: function realScale() {
		var img = React.findDOMNode(this.refs.image);
		var scale = img.width / img.naturalWidth;

		return Array.prototype.map.call(arguments, function (n) {
			return n / scale;
		});
	},

	pan: function pan(event) {
		var bounds = this.refs.image.getDOMNode().getBoundingClientRect();
		var x = Math.floor(event.clientX - bounds.left);
		var y = Math.floor(event.clientY - bounds.top);

		var newRect = [[x - this.getWidth() / 2, y - this.getHeight() / 2], [x + this.getWidth() / 2, y + this.getHeight() / 2]];

		newRect = geometry.constrainTranslation(newRect, [bounds.width, bounds.height]);

		this.setState({
			x0: newRect[0][0],
			y0: newRect[0][1],
			x1: newRect[1][0],
			y1: newRect[1][1]
		});

		var scaled = this.realScale(this.state.x0, this.state.y0, this.state.x1, this.state.y1);
		this.props.updateSelection(scaled[0], scaled[1], scaled[2], scaled[3]);
	},

	getWidth: function getWidth() {
		return this.state.x1 - this.state.x0;
	},

	getHeight: function getHeight() {
		return this.state.y1 - this.state.y0;
	},

	getTopRect: function getTopRect() {
		return {
			left: 0,
			top: 0,
			right: 0,
			height: this.state.y0
		};
	},

	getLeftRect: function getLeftRect() {
		return {
			left: 0,
			top: this.state.y0,
			width: this.state.x0,
			height: this.getHeight()
		};
	},

	getCenterRect: function getCenterRect() {
		return {
			left: this.state.x0,
			top: this.state.y0,
			width: this.getWidth(),
			height: this.getHeight()
		};
	},

	getRightRect: function getRightRect() {
		return {
			left: this.state.x0 + this.getWidth(),
			top: this.state.y0,
			right: 0,
			height: this.getHeight()
		};
	},

	getBottomRect: function getBottomRect() {
		return {
			left: 0,
			top: this.state.y0 + this.getHeight(),
			right: 0,
			bottom: 4 // WTF?
		};
	},

	renderMask: function renderMask(rect) {
		return React.createElement(Mask, {
			color: this.props.maskColor,
			shape: rect
		});
	},

	renderWindow: function renderWindow(rect) {
		return React.createElement(Mask, {
			className: "crop-window",
			shape: rect,
			onMouseDown: this.startPan() });
	}
});