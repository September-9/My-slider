import React, { Component } from 'react';
import cx from 'classnames'
import './slider.css'

class Slider extends Component {

  constructor(props) {
		super(props)
    this.state = {
      now: 0,
      dotNow: 0,
      renderData: this.props.children,
      startPoint: 0,
      endPoint: 0,
      startEle: 0
    }
    this.itemWidth = 200
  }
  static defaultProps = {
    delay: 3000
  }

	componentDidMount() {
    const children = this.props.children;
    if(Array.isArray(children)){
      this.createLoopRenderData();
      this.autoPlay();
      this.cssTransform(this.refs.sliderImgs, 'translateX', 0)
      this.stopped = false
    }else{
      clearInterval(this.timer)
      this.stopped = true
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  createLoopRenderData(){
    const children = this.props.children;
    this.setState({
      renderData: children.concat(children)
    })
  }

  touchStart(e) {
    e.stopPropagation()
    if (!this.stopped) {
      clearInterval(this.timer)
      const sliderImgsDOM = this.refs.sliderImgs
      const { length } = this.state.renderData
      sliderImgsDOM.style.transition = 'none'
      const moveX = this.cssTransform(sliderImgsDOM, 'translateX')
      let next = Math.round(-moveX / this.itemWidth)

      if (next === 0) {
        next = length / 2
      } else if (next === length - 1) {
        next = length / 2 - 1
      }
      this.cssTransform(sliderImgsDOM, 'translateX', -next * this.itemWidth)
      this.setState({
        startPoint: e.changedTouches[0].pageX,
        startEle: this.cssTransform(sliderImgsDOM, 'translateX')
      })
    }
  }
  touchMove(e) {
    e.stopPropagation()
    const sliderImgsDOM = this.refs.sliderImgs
    if (!this.stopped) {
      const endPoint = e.changedTouches[0].pageX
      const disX = endPoint - this.state.startPoint
      this.cssTransform(sliderImgsDOM, 'translateX', disX + this.state.startEle)
    }
  }
  touchEnd(e) {
    e.stopPropagation()
    if (!this.stopped) {
      const sliderImgsDOM = this.refs.sliderImgs
      const moveX = this.cssTransform(sliderImgsDOM, 'translateX')
      if (Math.abs(moveX) > Math.abs(this.state.now * this.itemWidth)) {
        this.setState(
          {
            now: Math.ceil(-moveX / this.itemWidth) //向上取整
          },
          () => {
            this.tab()
            this.autoPlay()
          }
        )
      } else {
        this.setState(
          {
            now: Math.floor(-moveX / this.itemWidth) //向下取整
          },
          () => {
            this.tab()
            this.autoPlay()
          }
        )
      }
    }
  }

  cssTransform(ele, attr, val) {
    if (!ele.transform) {
      ele.transform = {}
    }
    //当传入值时对属性进行设置。
    if (arguments.length > 2) {
      ele.transform[attr] = val
      var sval = ''
      for (var s in ele.transform) {
        if (s === 'translateX') {
          sval += s + '(' + ele.transform[s] + 'px)'
        }
        ele.style.WebkitTransform = ele.style.transform = sval
      }
    } else {
      val = ele.transform[attr]
      if (typeof val === 'undefined') {
        if (attr === 'translateX') {
          val = 0
        }
      }
      return val
    }
  }

  autoPlay() {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      const { length } = this.state.renderData
      if (this.state.now >= length - 1) {
        this.setState({ now: length / 2 - 1 })
        this.refs.sliderImgs.style.transition = 'none'
        this.cssTransform(this.refs.sliderImgs, 'translateX', -this.state.now * this.itemWidth)
      }
      setTimeout(() => {
        this.setState({ now: this.state.now + 1 }, () => {
          this.tab()
        })
      }, 30)
    }, this.props.delay)
  }
  tab() {
    this.refs.sliderImgs.style.transition = '.8s'
    this.cssTransform(this.refs.sliderImgs, 'translateX', -this.state.now * this.itemWidth)
    this.setState({
      dotNow: this.state.now % this.props.children.length
    })
  }


  render(){
    const { length } = this.props.children
    const style = {
      transitionDuration: this.props.speed + 's',
      width: length * 2 * 100 + '%'
    }
    let dotNodes = []
    if (length === 1) {
      dotNodes = []
    } else {
      for (let i = 0; i < length; i++) {
        dotNodes[i] = (
          <span
            key={'dot' + i}
            className={cx('slider-dot', { 'slider-dot-selected': i === this.state.dotNow })}
          />
        )
      }
    }
    
    return (
      <div
        className="slider-wrap"
        ref="slider"
        onTouchStart={e => this.touchStart(e)}
        onTouchMove={e => this.touchMove(e)}
        onTouchEnd={e => this.touchEnd(e)}
      >
        <div className="slider-ul" ref="sliderImgs" style={style}>
          {this.state.renderData}
        </div>
        <div className="slider-dots-wrap" ref="sliderDots">
          {dotNodes}
        </div>
      </div>
    )
  }
}	

export default Slider;
