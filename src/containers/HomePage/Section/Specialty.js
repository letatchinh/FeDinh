import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllSpecialty } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import ModalCard from "../../../../src/components/ModalCard";

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
      show: false,
      data: [],
      title: "Doctors",
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {}

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

      default: {
        break;
      }
    }
  };

  render() {
    let { dataSpecialty } = this.state;
    const { show, data, title } = this.state;
    return (
      <>
        <ModalCard
          show={show}
          title={title}
          data={data}
          setShow={(check) => {
            this.setState({ ...this.setState, show: check });
          }}
        />
        <div className="section-share section-specialty">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">
                <FormattedMessage id="homepage.specialty-popular" />
              </span>
              <button
                className="btn-section"
                onClick={() => this.handleData("DOCTOR")}
              >
                <FormattedMessage id="homepage.more-infor" />
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataSpecialty &&
                  dataSpecialty.length > 0 &&
                  dataSpecialty.map((item, index) => {
                    return (
                      <div
                        className="specialty-customize specialty-child"
                        key={index}
                        onClick={() => this.handleViewDetailSpecialty(item)}
                      >
                        <div
                          className="bg-image section-specialty"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="specialty-name">{item.name}</div>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
