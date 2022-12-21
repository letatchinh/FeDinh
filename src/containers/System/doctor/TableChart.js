import React, { Component } from "react";
// import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import "../Admin/TableManageUser.scss"
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import { getAllSpecialty } from "../../../services/userService";
import DatePicker from "../../../components/Input/DatePicker";
import "./ManagePatient.scss";
import { Button } from "reactstrap";
import Select from "react-select";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log("handleEditorChange", html, text);
}

class TableChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
        listMain : [],
        currentDate1 : '',
        currentDate2 : '',
        listShow : [],
        listBs : [],
        selectedBs : {value : "" ,label : "All"}
    };
  }
  handleChangeSelectBs = (selectedOption) => {
    this.setState({
      selectedBs: selectedOption,
    });
  };
  changeListMain = (date1,date2) => {
      const newList = this.state.listShow.filter(e => {
        if(this.state.selectedBs.value === ""){
        return  e.date >= Date.parse(date1) && e.date <= Date.parse(date2)
        }
        else {
          return e.date >= Date.parse(date1) && e.date <= Date.parse(date2) && e.doctorId === this.state.selectedBs.id
        }
      })
      this.setState({listMain : newList})
  }
 Back = () => {
  this.setState({listMain : this.state.listShow ,currentDate1 : "",currentDate2:"",selectedBs:"" })
 }
  handleOnchangeDataPicker1 = (date) => {
    this.setState(
      {
        currentDate1: date[0],
      }
    );
  };
  handleOnchangeDataPicker2 = (date) => {
    this.setState(
      {
        currentDate2: date[0],
      }
    );
  };
 async componentDidMount() {
    this.props.fetchUserRedux();
   await  getAllSpecialty().then(res => {
      const newList = this.props.dataS3.map(e => {
    let ress = {}
    res.data.forEach(ee => {
        if(e.chuyenkhoaId === ee.id){
            ress = {...e,nameCk : ee.name}
        }
    })
    return ress
})

   this.setState({listMain : newList,listShow : newList});
   const newListBs = this.props.listUsers.filter(e => e.roleId === "R2")
   this.setState({listBs : newListBs})
   })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({
        usersRedux: this.props.listUsers,
      });
    }
  }

  convertDay(day){
    let now = new Date(parseInt(day))
    return (now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear());
  }
  render() {
    console.log(this.props.dataS3);
      const {listMain,listBs,listShow} = this.state
      const newlistBs = listBs.map(e => ({value : e.lastName + " " + e.firstName , label : e.lastName + " " + e.firstName , id : e.id}))
    return (
      <React.Fragment>
     <div style={{padding : '10px' , border : '1px solid #999' ,borderRadius : '10px' , margin : '20px'}}>
     <p style={{fontWeight : 600}}>Thống kê bệnh nhân đã khám</p>
     <div style={{display : 'flex' , gap : '50px' , margin : '20px 50px' , alignItems : 'flex-end'}}>
      <div>
      <p>Từ ngày</p>
      <DatePicker
                  onChange={this.handleOnchangeDataPicker1}
                  className="form-control width"
                  value={this.state.currentDate1}
                  
                />
      </div>
      <div>
      <p>đến ngày</p>
      <DatePicker
                  onChange={this.handleOnchangeDataPicker2}
                  className="form-control width"
                  value={this.state.currentDate2}
                  minDate={this.state.currentDate1}
                />
      </div>
     <div style={{width : '200px'}}>
     <Select 
                  value={this.state.selectedBs}
                  onChange={this.handleChangeSelectBs}
                  options={[{value : "",label : "All"},...newlistBs]}
                />
     </div>
      <Button color="primary" onClick={() => this.changeListMain(this.state.currentDate1,this.state.currentDate2)} style={{cursor : 'pointer'}}>Find</Button>
      <Button color="primary" onClick={this.Back}>Reset</Button>
      </div>
      {listMain.length === 0 ? <div>Empty</div> :   <table id="TableManageUser">
          <tbody>
            <tr>
            
              <th>Stt</th>
              <th>Tên Bác sĩ</th>
              <th>Chuyên khoa</th>
              <th>Tên bệnh nhân</th>
              <th>Giá tiền</th>
              <th>Ngày Khám</th>
              
            </tr>
            {listMain &&
              listMain.length > 0 &&
              listMain.map((item, index) => {

                return (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{item.name}</td>
                    <td>{item.nameCk}</td>
                    <td>{item.patientData && item.patientData.firstName}</td>
                    <td>{item.price}</td>
                    <td>{`${item.timeTypeDataPatient && item.timeTypeDataPatient.valueEn} ${item.date && this.convertDay(item.date)}`}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>}
     </div>

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
    deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableChart);
