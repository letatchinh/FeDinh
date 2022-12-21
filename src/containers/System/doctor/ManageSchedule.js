import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageSchedule.scss';
import {LANGUAGES,} from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
// import moment from 'moment';
import Select from 'react-select';
import {toast} from 'react-toastify';
import _ from 'lodash';
import {deleteScheduleDoctorByDate, getScheduleDoctorByDate, saveBulkScheduleDoctor} from '../../../services/userService';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

class ManageSchedule extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
            scheduleDoctor : [],
            modal: false,
            state : false
        }
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
        if(this.props.userInfo.roleId === "R2"){
            this.setState({ selectedDoctor: this.props.userInfo});
        }
        
        // console.log(this.props.userInfo);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
               listDoctors: dataSelect
            })
        }

        if(prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if(data && data.length > 0){
                data = data.map(item => ({ ...item, isSelected: false}))
            }
            this.setState({
              rangeTime: data
            })
        }
        
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let {language} = this.props;
        if(inputData && inputData.length > 0){
            // eslint-disable-next-line array-callback-return
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        await  getScheduleDoctorByDate(selectedOption.value, Date.parse(this.state.currentDate)).then(res => {this.setState({scheduleDoctor : res.data}) })
        this.setState({ selectedDoctor: selectedOption});
    }

    handleOnchangeDataPicker = async(date) => {
        if(this.props.userInfo.roleId === "R1"){
            await  getScheduleDoctorByDate(this.state.selectedDoctor.value, Date.parse(date[0])).then(res => {this.setState({scheduleDoctor : res.data}) })
        }
        else{
            await  getScheduleDoctorByDate(this.props.userInfo.id, Date.parse(date[0])).then(res => this.setState({scheduleDoctor : res.data}))
        }
     
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let {rangeTime} = this.state;
        if(rangeTime && rangeTime.length > 0){
            rangeTime = rangeTime.map(item => {
                if(item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    };
    deleteScheduleDoctorByDate = async () => {
        let {selectedDoctor, currentDate} = this.state;
        let res = await deleteScheduleDoctorByDate(
            this.props.userInfo.roleId === "R2" ? selectedDoctor.id : selectedDoctor.value,
            Date.parse(currentDate)
        )

        if(res && res.errCode === 0){
            await  getScheduleDoctorByDate(this.props.userInfo.id, Date.parse(currentDate)).then(res => this.setState({scheduleDoctor : res.data}))
            toast.success("Reset lịch thành công!")
        }else{
            toast.error("Reset lịch thất bại")
        }
       
    }
    handleSaveSchedule = async () => {
        let {rangeTime, selectedDoctor, currentDate} = this.state;
        let result = [];

        if(!currentDate) {
            toast.error("Chưa chọn time!");
            return;
        }
        if(selectedDoctor && _.isEmpty(selectedDoctor)){
            toast.error("Chưa chọn bác sĩ!");
            return;
        }

        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        let formatedDate = new Date(currentDate).getTime();

        if(rangeTime && rangeTime.length > 0){
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if(selectedTime && selectedTime.length > 0){
                // eslint-disable-next-line array-callback-return
                selectedTime.map((schedule, index) => {
                    let object = {};
                    object.doctorId = this.props.userInfo.roleId === "R2" ? selectedDoctor.id : selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })
            }else{
                toast.error("Chưa chọn time!")
                return;
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: this.props.userInfo.roleId === "R2" ? selectedDoctor.id : selectedDoctor.value,
            formatedDate: formatedDate
        })

        if(res && res.errCode === 0){
            if(this.props.userInfo.roleId === "R2"){
                await  getScheduleDoctorByDate(this.props.userInfo.id, Date.parse(this.state.currentDate)).then(res => this.setState({scheduleDoctor : res.data}))
            }
            else{
                await  getScheduleDoctorByDate(selectedDoctor.value, Date.parse(this.state.currentDate)).then(res => this.setState({scheduleDoctor : res.data}))
            }
            let data = this.props.allScheduleTime;
            if(data && data.length > 0){
                data = data.map(item => ({ ...item, isSelected: false}))
            }
            this.setState({
              rangeTime: data
            })
            toast.success("Tạo lịch thành công!")
        }else{
            toast.error("Tạo lịch thất bại")
        }

  
    }

    render() {
       
        let {rangeTime,listDoctors,scheduleDoctor,selectedDoctor} = this.state;
        console.log(rangeTime,"scheduleDoctor");
        let {language,userInfo} = this.props;
  
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        
        return (
            <React.Fragment>
                <div className='manage-schedule-container'>
                    <div className='m-s-title'>
                        <FormattedMessage id='manage-schedule.title'/>
                    </div>
                    <div className='container'>
                        <div className='col-6 form-group'>
                          
                          { userInfo.roleId === "R1" && <Select
                                value={this.props.selectedOption}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />}
                         
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id='manage-schedule.choose-date'/></label>
                            <DatePicker
                                onChange={this.handleOnchangeDataPicker}
                                className="form-control"
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return(
                                        <button 
                                        disabled={scheduleDoctor.some(e => e.timeType === item.keyMap)} 
                                        className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'} 
                                        key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button
                            // disabled={this.state.rangeTime.length === 0}
                             style={{marginRight : '50px'}} className='btn btn-primary btn-save-schedule'
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id='manage-schedule.save'/>
                            </button>
                            <button
                            disabled={scheduleDoctor.length === 0}
                             className='btn btn-secondary btn-save-schedule'
                                onClick={this.toggle}
                            >
                               Reset
                            </button>
                        </div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          
          <ModalBody>
          Xác Nhận Reset
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {this.deleteScheduleDoctorByDate() ;this.toggle()}}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
