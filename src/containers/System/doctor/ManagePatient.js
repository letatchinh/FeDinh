import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  deleteBooking,
  getAllPatientForDoctor,
  postSendRemedy,
} from "../../../services/userService";
import moment from "moment";
import RemedyModal from "./RemedyModal";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";
import { LANGUAGES } from "../../../utils";
import axios from 'axios'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
      status : false,
      modal: false
    };
    this.toggle = this.toggle.bind(this);
  }

  async componentDidMount() {
    this.getDataPatient();
  } 
  toggle() {
    console.log("ok");
    this.setState({
      modal: !this.state.modal
    });
  }
  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formatedDate,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
    // console.log("check patient: ", res);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {}

  handleOnchangeDataPicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };

    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
    console.log("data patinet: ", data);
  };

  closeRemedyModal = (data) => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };
  deleteBooking = async(id) => {
    // eslint-disable-next-line no-restricted-globals
        await deleteBooking(id)
      this.getDataPatient()
      this.setState({status : !this.state.status})
      this.toggle() 
   
       }
  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });

    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });

    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Send Remedy succeeds!");
      this.closeRemedyModal();
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Something wrongs...");
      this.closeRemedyModal();
      await this.getDataPatient();
    }
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
    let { language } = this.props;
    console.log(dataPatient);
    // console.log("check data: ", this.state);
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading..."
        >
          <div className="manage-patient-container">
            <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
            <div className="manage-patient-body row">
              <div className="col-4 form-group mb-3">
                <label>Chọn ngày khám</label>
                <DatePicker
                  onChange={this.handleOnchangeDataPicker}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-12 table-manage-patient">
                <table style={{ width: "100%" }}>
                  <tbody className="text-center">
                    <tr>
                      <th>STT</th>
                      <th>Thời gian</th>
                      <th>Họ và tên</th>
                      <th>Địa chỉ</th>
                      <th>Số điện thoại</th>
                      <th>Giới tính</th>
                      <th>Actions</th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      // eslint-disable-next-line array-callback-return
                      dataPatient.map((item, index) => {
                        let time =
                          language === LANGUAGES.VI
                            ? item.timeTypeDataPatient.valueVi
                            : item.timeTypeDataPatient.valueEn;
                        let gender =
                          language === LANGUAGES.VI
                            ? item.patientData.genderData.valueVi
                            : item.patientData.genderData.valueEn;

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time}</td>
                            <td>{item.patientData.firstName}</td>
                            <td>{item.patientData.address}</td>
                            <td>{item.patientData.phonenumber}</td>
                            <td>{gender}</td>
                            <td>
                              <button
                                className="mp-btn-confirm"
                                onClick={() => this.handleBtnConfirm(item)}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="mp-btn-confirm"
                                onClick={this.toggle}
                              >
                                Huỷ
                              </button>
                              <Modal style={{width : '200px'}} isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalBody style={{textAlign : 'center'}}>
           Xác Nhận xoá
          </ModalBody>
          <ModalFooter style={{justifyContent : 'center'}}>
            <Button color="primary" onClick={() => {this.deleteBooking(item.id)}}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
                              {/* <button
                                className="mp-btn-remedy"
                                onClick={() => this.handleBtnRemedy()}
                              >
                                Gửi hóa đơn
                              </button> */}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          no data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
