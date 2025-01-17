import React, {Component} from 'react';
import "./Map.css";
import Button from '@material-ui/core/Button';
import * as fetch from "node-fetch";

class Map extends Component {

  // NOTE:
  // This component is a suggestion for you to use, if you would like to.
  // It has some skeleton code that helps set up some of the more difficult parts
  // of getting <canvas> elements to display nicely.
  //
  // If you don't want to use this component, you're free to delete it.

  constructor(props) {
    super(props);
    this.backgroundImage = new Image();
    this.canvasReference = React.createRef();
    this.backgroundImage.onload = () => {
      this.drawBackgroundImage();
    };
    this.backgroundImage.src = "campus_map.jpg";
  }

  drawBackgroundImage () {
    let canvas = this.canvasReference.current;
    let ctx = canvas.getContext("2d");
    if (this.backgroundImage.complete) { // This means the image has been loaded.
      canvas.width = this.backgroundImage.width;
      canvas.height = this.backgroundImage.height;
      ctx.drawImage(this.backgroundImage, 0, 0);
    }
  }

  handleDraw = () => {
    this.drawPath();
  }

  drawPath = () => {
    let responsePromise = fetch("http://localhost:4567/findPath/" + this.props.start + "/" + this.props.end);
    let responseTextPromise = responsePromise.then((res) => {return res.json()});
    responseTextPromise.then(
        (responseText) => {
            for (let i = 0; i < responseText.path.length; i++) {
                let x1 = responseText.path[i].start.x;
                let y1 = responseText.path[i].start.y;
                let x2 = responseText.path[i].end.x;
                let y2 = responseText.path[i].end.y;
                this.drawLine(x1, y1, x2, y2);
            }
        },
        (error) => {
            alert("unknown building key, please type a new one");
        }
    );
  }

  drawLine = (x1, y1, x2, y2) => {
    let ctx = this.canvasReference.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "red";
    ctx.stroke();
  }

  clearMap = () => {
    this.redraw();
    this.props.onChange();
  }

  redraw = () => {
    let ctx = this.canvasReference.current.getContext('2d');
    ctx.clearRect(0, 0, this.canvasReference.current.width, this.canvasReference.current.height);
    this.backgroundImage.onload = () => {
          this.drawBackgroundImage();
    };
    this.backgroundImage.src = "campus_map.jpg";
  }

  render() {
    return (
        <div className="canvasHolder">
            <Button color="primary" onClick={this.handleDraw}>
                Draw Path
            </Button>
            <Button color="secondary" onClick={this.clearMap}>
                Reset
            </Button>
            <div className="canvas">
                <canvas ref={this.canvasReference}/>
            </div>
        </div>
    )
  }
}

export default Map;