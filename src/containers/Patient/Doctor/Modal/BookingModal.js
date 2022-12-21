import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import _, { forIn } from "lodash";
import ProfileDoctor from "../ProfileDoctor";
import { LANGUAGES } from "../../../../utils/constant";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../../store/actions";
import moment from "moment";
import DatePicker from "react-flatpickr";
// import { lang } from "moment";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: "",
      timeType: "",
      status : false,
      modal: false
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  async componentDidMount() {
    this.props.getGenders();
  }

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      // eslint-disable-next-line array-callback-return
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }

  handleOnchangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  handleOnchangeDataPicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({
      selectedGender: selectedOption,
    });
  };

  buildTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;

      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return `${time} + ${date}`;
    }
    return "";
  };

  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;

      return name;
    }
    return "";
  };
  checkEmpty = (obj) => {
    console.log(obj);
    let flag = false
   for (const key in obj) {
    if(key === "doctorId" || key === "genders" || key === "timeType" || key === "status"){
      console.log(key);
    }
    else {
      if(obj[key] === "") flag = true
    }
   }
    return flag
  }
  handleConfirmBooking = async () => {
    let date = new Date(this.state.birthday).getTime();
    let timeString = this.buildTimeBooking(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime);
    if(this.checkEmpty(this.state)){
      this.setState({status : true})
    }
    else {
      this.setState({status : false})
      
          let res = await postPatientBookAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: this.props.dataTime.date,
      birthday: date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
    });
   
    if (res && res.errCode === 0) { 
      toast.success("Booking a new appointment succeed!");
      this.props.closeBookingClose();
      this.toggle()
      this.setState({
        fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      })
    } else {
      toast.error("Lịch này đã có người đặt!");
    }
    }

  };

  render() {
    
    let { isOpenModal, closeBookingClose, dataTime } = this.props;
    let doctorId = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }
    console.log("check booking: ", this.state);
    return (
     <>
       <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="lg"
        centered
      >
      
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <FormattedMessage id="patient.booking-modal.title" />
            </span>
            <span className="right" onClick={closeBookingClose}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            <div className="doctor-infor">
              <ProfileDoctor
                doctorId={doctorId}
                isShowDescriptionDoctor={false}
                dataTime={dataTime}
                isShowLinkDetail={false}
                isShowPrice={true}
              />
            </div>
            <div className="price"></div>
            <div className="row">
              <div className="col-6 from-group">
                <label>
                  {/* <FormattedMessage id="patient.booking-modal.fullName" /> */}
                  Họ và tên <span style={{color : 'red' , display : this.state.fullName === "" ? 'inline' : 'none'}}>*</span>
                </label>
                <input
                  className="form-control"
                  value={this.state.fullName}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "fullName")
                  }
                />
                <span style={{color : 'red',display : this.state.fullName !== "" || this.state.status === false ? 'none' : 'inline'}}>Vui lòng điền đủ thông tin</span>
              </div>
              <div className="col-6 from-group">
                <label>
                  {/* <FormattedMessage id="patient.booking-modal.phoneNumber" /> */}
                  Số điện thoại <span style={{color : 'red',display : this.state.phoneNumber === "" ? 'inline' : 'none'}}>*</span>
                </label>
                <input
                  className="form-control"
                  value={this.state.phoneNumber}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "phoneNumber")
                  }
                />
                 <span style={{color : 'red',display : this.state.phoneNumber !== "" || this.state.status === false ? 'none' : 'inline'}}>Vui lòng điền đủ thông tin</span>
              </div>
              <div className="col-6 from-group">
                <label>
                  {/* <FormattedMessage id="patient.booking-modal.email" /> */}
                  Địa chỉ Email <span style={{color : 'red',display : this.state.email === "" ? 'inline' : 'none'}}>*</span>
                </label>
                <input
                  className="form-control"
                  value={this.state.email}
                  onChange={(event) => this.handleOnchangeInput(event, "email")}
                />
                 <span style={{color : 'red',display : this.state.email !== "" || this.state.status === false ? 'none' : 'inline'}}>Vui lòng điền đủ thông tin</span>
              </div>
              <div className="col-6 from-group">
                <label>
                  {/* <FormattedMessage id="patient.booking-modal.address" /> */}
                  Địa chỉ liên lạc <span style={{color : 'red',display : this.state.address === "" ? 'inline' : 'none'}}>*</span>
                </label>
                <input
                  className="form-control"
                  value={this.state.address}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "address")
                  }
                />
                 <span style={{color : 'red',display : this.state.address !== "" || this.state.status === false ? 'none' : 'inline'}}>Vui lòng điền đủ thông tin</span>
              </div>
              <div className="col-12 from-group">
                <label>
                  {/* <FormattedMessage id="patient.booking-modal.reason" /> */}
                  Lí do khám <span style={{color : 'red',display : this.state.reason === "" ? 'inline' : 'none'}}>*</span>
                </label>
                <input
                  className="form-control"
                  value={this.state.reason}
                  onChange={(event) =>
                    this.handleOnchangeInput(event, "reason")
                  }
                />
                 <span style={{color : 'red',display : this.state.reason !== "" || this.state.status === false ? 'none' : 'inline'}}>Vui lòng điền đủ thông tin</span>
              </div>
              <div className="col-6 from-group">
                <label>
                  {/* <FormattedMessage id="patient.booking-modal.birthday" /> */}
                  Ngày sinh <span style={{color : 'red',display : this.state.birthday === "" ? 'inline' : 'none'}}>*</span>
                </label>
                <DatePicker
                  className="form-control"
                  value={this.state.birthday}
                  onChange={this.handleOnchangeDataPicker}
                />
              <span style={{color : 'red',display : this.state.birthday !== "" || this.state.status === false ? 'none' : 'inline'}}>Vui lòng điền đủ thông tin</span>
              </div>
              <div className="col-6 from-group">
                <label>
                  {/* <FormattedMessage id="patient.booking-modal.gender" /> */}
                  Giới tính <span style={{color : 'red',display : this.state.selectedGender === "" ? 'inline' : 'none'}}>*</span>
                </label>
                <Select
                  value={this.state.selectedGender}
                  onChange={this.handleChangeSelect}
                  options={this.state.genders}
                />
                 <span style={{color : 'red',display : this.state.selectedGender !== "" || this.state.status === false ? 'none' : 'inline'}}>Vui lòng điền đủ thông tin</span>
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button 
              className="btn-booking-confirm"
              onClick={() => this.handleConfirmBooking()}
            >
              <FormattedMessage id="patient.booking-modal.btnConfirm" />
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingClose}>
              <FormattedMessage id="patient.booking-modal.btnCancel" />
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
        
          <ModalBody>
            Xin vui lòng vào gmail để xác nhận
          </ModalBody>
          <ModalFooter>
         
            <Button color="secondary" onClick={this.toggle}>Ok</Button>
          </ModalFooter>
        </Modal>
     </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
