import React, { Component } from "react";
// import { Redirect } from 'react-router-dom';
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES } from "../../utils/constant";
import "./HomeHeader.scss";
import { changeLanguageApp } from "../../store/actions/appActions";
// import Modal from "react-bootstrap/Modal";
import ModalCard from "../../components/ModalCard";
// import axios from "axios";
import { getAllClinic, getAllDoctors, getAllSpecialty } from "../../services/userService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
// import {withRouter} from 'react-router';

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      data: [],
      title: "Doctors",
      textSearch: "",
      resultSearch: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }
  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  async handleChange(event) {
    this.setState({ ...this.state, textSearch: event.target.value });
    axios
      .get(
        `http://localhost:6969/api/get-clinic-by-name?name=${this.state.textSearch}`
      )
      .then((res) =>
        this.setState({ ...this.state, resultSearch: res.data.data })
      );
  }

  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };

  handleData = async (type) => {
    switch (type) {
      case "DOCTOR": {
        const res = await getAllSpecialty();
        console.log("check db: ", res);
        const data = res.data.map((x) => ({
          title: x.name,
          img: x.image,
          id: x.id,
          to: "/detail-specialty",
        }));

        this.setState({
          ...this.state,
          title: "Chuyên Khoa",
          show: true,
          data,
        });
        break;
      }

      case "HEALTH": {
        const res = await getAllClinic();
        const data = res.data.map((x) => ({
          title: x.name,
          img: x.image,
          id: x.id,
          to: "/detail-clinic",
        }));

        this.setState({
          ...this.state,
          title: "Cơ sở y tế",
          show: true,
          data,
        });
        break;
      }
      case "BACSI": {
        const res = await getAllDoctors();
        console.log(res);
        const data = res.data.map((x) => ({
          title: x.lastName + " " + x.firstName,
          img: x.image,
          id: x.id,
          to: "/detail-doctor",
        }));

        this.setState({
          ...this.state,
          title: "Bác sĩ",
          show: true,
          data,
        });
        break;
      }
      default: {
        break;
      }
    }
  };

  render() {
    let language = this.props.language;
    const { show, data, title } = this.state;
    return (
      <React.Fragment>
        <ModalCard
          show={show}
          title={title}
          data={data}
          setShow={(check) => {
            this.setState({ ...this.setState, show: check });
          }}
        />
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i
                className="fas fa-bars"
                onClick={() => this.returnToHome()}
              ></i>
              <div className="header-logo" onClick={this.returnToHome}>
              <Link to={`/home`} >
                <img style={{width : '50px' , height : '50px' , objectFit : 'cover'}} src="https://png.pngtree.com/png-clipart/20190619/original/pngtree-vector-doctor-icon-png-image_3995116.jpg" alt="logo"/>
                 
                </Link>
              </div>
            </div>

            <div className="center-content">
              <div
                className="child-content"
                onClick={() => this.handleData("DOCTOR")}
              >
                <div>
                  <b>
                    <FormattedMessage id="homeheader.speciality" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.searchdoctor" />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleData("HEALTH")}
              >
                <div>
                  <b>
                    <FormattedMessage id="homeheader.healthy-facility" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-room" />
                </div>
              </div>
              <div className="child-content"  onClick={() => this.handleData("BACSI")}>
                <div>
                  <b>
                    <FormattedMessage id="homeheader.doctor" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="homeheader.fee" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.check-health" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle">
                  <FormattedMessage id="homeheader.support" />
                </i>
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span
                  onClick={() => {
                    this.changeLanguage(LANGUAGES.VI);
                  }}
                >
                  VN
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span
                  onClick={() => {
                    this.changeLanguage(LANGUAGES.EN);
                  }}
                >
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="banner.title1" />
              </div>
              <div className="title2">
                <FormattedMessage id="banner.title2" />
              </div>
              <div className="search" style={{ position: "relative" }}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  value={this.state.textSearch}
                  onChange={this.handleChange}
                  placeholder="Tìm phòng khám"
                />
                <div
                  style={{
                    display : this.state.textSearch.length === 0 ? 'none' : 'flex',
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "5px",
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    maxHeight : '20rem',
                    overflowY : 'scroll'
                  }}
                >
                  {this.state.resultSearch.map((e) => (
                    e.address ? <div
                      style={{ boxShadow: " 0 0 5px 2px #999", width: "100%" , display : 'flex', justifyContent : 'space-between' , alignItems : 'center', padding : '5px',borderRadius : '10px' }}
                      key={e.id}
                    >
                      <div style={{width : '70%' ,display : 'flex' , flexDirection : 'column'}}>
                        <span>{e.name}</span>
                       
                        {e.lastName && <span>Doctor : {e.lastName + " " +e.firstName}</span>}
                        <span>{e.address}</span>
                      </div>
                      {e.lastName  ? <Link to={`/detail-doctor/${e.id}`} className="fs-5 mx-4">
                      <Button style={{width : '100px' , height : '50px'}}>Xem Thêm</Button>
                </Link> : <Link to={`/detail-clinic/${e.id}`} className="fs-5 mx-4">
                      <Button style={{width : '100px' , height : '50px'}}>Xem Thêm</Button>
                </Link>}
                      
                      
                    </div> : 
                    <div
                      style={{ boxShadow: " 0 0 5px 2px #999", width: "100%" , display : 'flex', justifyContent : 'space-between' , alignItems : 'center', padding : '5px',borderRadius : '10px' }}
                      key={e.id}
                    >
                      <div style={{width : '70%' ,display : 'flex' , flexDirection : 'column'}}>
                        <span>{e.name}</span>
                       
                        {e.lastName && <span>Specialty : {e.lastName + " " +e.firstName}</span>}
                        <span>{e.address}</span>
                      </div>
                      <Link to={`/detail-specialty/${e.id}`} className="fs-5 mx-4">
                      <Button style={{width : '100px' , height : '50px'}}>Xem Thêm</Button>
                </Link>
                      
                    </div> 
                    
                  ))}
                </div>
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div className="icon-child">
                    <i className="far fa-hospital"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child1" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child2" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-procedures"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child3" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-flask"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child4" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child5" />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-briefcase-medical"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
