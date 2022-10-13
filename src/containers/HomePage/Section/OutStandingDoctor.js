import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';



class OutStandingDoctor extends Component {

    render() {
       return(
        <div className='section-share section-specialty section-outstanding-doctor'>
        <div className='section-container'>
          <div className='section-header'>
            <span className='title-section'>Bác sĩ nổi bật</span>
            <button className='btn-section'>Xem thêm</button>
          </div>
          <div className='section-body'>
          <Slider {...this.props.settings}>
            <div className='specialty-customize'>
              <div className='bg-image'/>
              <div>Hệ thống y tế thu cúc 1</div>
            </div>
            <div className='specialty-customize'>
              <div className='bg-image'/>
              <div>Hệ thống y tế thu cúc 1</div>

            </div>
            <div className='specialty-customize'>
              <div className='bg-image'/>
              <div>Hệ thống y tế thu cúc 1</div>

            </div>
            <div className='specialty-customize'>
              <div className='bg-image'/>
              <div>Hệ thống y tế thu cúc 1</div>

            </div>
            <div className='specialty-customize'>
              <div className='bg-image'/>
              <div>Hệ thống y tế thu cúc 1</div>

            </div>
            <div className='specialty-customize'>
              <div className='bg-image'/>
              <div>Hệ thống y tế thu cúc 1</div>
              <div>Tim mach 1</div>
            </div>
          </Slider>
          </div>
        </div>
        </div>
       )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
