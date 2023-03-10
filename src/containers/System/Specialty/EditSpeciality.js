import React, { Component } from "react";
import { connect } from "react-redux";
import "../Admin/ManageDoctor.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils/constant";
import { getDetailInforDoctor } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import axios from "axios";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!

class EditSpeciality extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedOption: null,
      contentMarkdown: "",
      contentHTML: "",
      //save to doctor info table
    };
  }

  async componentDidMount() {
    const res = await axios.get(`http://localhost:6969/api/get-specialty`);
    this.setState({
      listDoctors: res.data.data,
    });
  }
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        // eslint-disable-next-line array-callback-return
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        });
      }
    }
    return result;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let { resPayment, resPrice, resProvince } =
        this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );

      this.setState({
        listDoctors: dataSelect,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
      });
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });

    console.log("handleEditorChange: ", html, text);
  };
  handleSaveContentMarkdown = async () => {
    const newSpe = {
      ...this.state.selectedOption.item,
      descriptionMarkdown: this.state.contentMarkdown,
      descriptionHTML: this.state.contentHTML,
    };
    axios
      .put(`http://localhost:6969/api/update-specialty?id=${newSpe.id}`, newSpe)
      .then((res) => {
        if (res.status === 200) {
          alert("update Thanh cong");
        }
        else{
          alert("updaet that bai")
        }
      });
  };
  handleDelteContentMarkdown = async () => {
   await axios.delete(`http://localhost:6969/api/delete-specialty?id=${this.state.selectedOption.item.id}`).then(res => {alert("Xo?? Th??nh c??ng") ;this.setState({selectedOption : null , contentMarkdown : "" , contentHTML : ""})})
   const res = await axios.get(`http://localhost:6969/api/get-specialty`);
   this.setState({
     listDoctors: res.data.data,
   });
  }
  handleChangeSelect = async (selectedOption) => {
    this.setState({
      selectedOption,
      contentMarkdown: selectedOption.item.descriptionMarkdown,
      contentHTML: selectedOption.item.descriptionHTML,
    });
  };

  render() {
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <p>Edit th??ng tin chuy??n khoa</p>
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label>
              <span>Ch???n Chuy??n khoa</span>
            </label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors.map((e) => ({
                value: e.name,
                label: e.name,
                item: e,
              }))}
              placeholder={<span>Ch???n Chuy??n khoa</span>}
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>
        <button style={{marginRight : '20px'}}
          onClick={() => this.handleSaveContentMarkdown()}
          className="save-content-doctor"
        >
          <span>
            <FormattedMessage id="admin.manage-doctor.save" />
          </span>
        </button>
        <button style={{display : this.state.selectedOption ? 'inline' : 'none'}}
          onClick={() => this.handleDelteContentMarkdown()}
          className="create-content-doctor"
        >
          <span>
          <span>Delete</span>
          </span>
        </button>
      </div>
    );
  }
}


export default EditSpeciality;
