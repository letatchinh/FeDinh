import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import "./medicalFacility.scss";
import { withRouter } from "react-router";
import { getAllClinic } from "../../../services/userService";
import ModalCard from "../../../../src/components/ModalCard";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: [],
      show: false,
      data: [],
      title: "Doctors",
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinics: res.data ? res.data : [],
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  };

  handleData = async (type) => {
    switch (type) {
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

      default: {
        break;
      }
    }
  };

  render() {
    let { dataClinics } = this.state;
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
        <div className="section-share section-medical-facility">
          <div className="section-container">
            <div className="section-header">
              <span className="title-section">Cở sở y tế nổi bật</span>
              <button
                className="btn-section"
                onClick={() => this.handleData("HEALTH")}
              >
                Xem thêm
              </button>
            </div>
            <div className="section-body">
              <Slider {...this.props.settings}>
                {dataClinics &&
                  dataClinics.length > 0 &&
                  dataClinics.map((item, index) => {
                    return (
                      <div
                        className="specialty-customize specialty-child clinic-child"
                        key={index}
                        onClick={() => this.handleViewDetailClinic(item)}
                      >
                        <div
                          className="bg-image section-specialty section-medical-facility"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="clinic-name">{item.name}</div>
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
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
