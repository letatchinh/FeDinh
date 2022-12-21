import axios from "axios";
import { uniqueId } from "lodash";
import React, { Component } from "react";
import { PieChart } from "react-minimal-pie-chart";
import {
  getAllCodeServicePrice,
  getAllDoctors,
  s3,
} from "../../../services/userService";
import TableChart from "./TableChart";
import TopChartDoctor from "./TopChartDoctor";
class ChartDoctorBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctor: [],
      listS3: [],
      cac: [],
      c: [],
    };
  }
  async componentDidMount() {
    s3().then((resss) => {this.setState({ listS3: resss.data })
   
  });
  getAllDoctors().then((res) => {
    this.setState({ listDoctor: res.data, cac: res.cac });
    const ar = res.cac.map(e => (e.priceId))
    // res.cac.forEach((e) =>
      getAllCodeServicePrice(ar).then((ress) =>
        this.setState({
          c: ress.data,
        })
      )
    // );
  });
  }
  random_bg_color() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + x + "," + y + "," + z + ")";
    return bgColor;
  }
  render() {
    const { listDoctor, listS3, cac, c } = this.state;
    console.log(c);
    //  console.log(listDoctor,'l');

    // let u = []
    // cac.map(async(e) => {
    //  await getAllCodeServicePrice(e.priceId).then(res => u.push({...e,price : res.data[0].valueVi}))

    // })
    //   console.log(u,"u");
    let newList = listDoctor.map((e) => ({
      name: e.lastName + " " + e.firstName,
      color: this.random_bg_color(),
      doctorId: e.id,
    }));
    const newList2 = newList.map((e) => {
      let count = 0;
      listS3.forEach((f) => {
        if (e.doctorId === f.doctorId) {
          count++;
        }
      });
      return { ...e, count };
    });
    const nameDoctorList = listS3.map((e) => {
      let res = {};
      newList.forEach((f) => {
        if (e.doctorId === f.doctorId) {
          res = { ...e, name: f.name };
        }
      });
      cac.forEach((ee) => {
        if (ee.doctorId === e.doctorId) {
          res = { ...res, chuyenkhoaId: ee.specialtyId };
          c.forEach((eeee) => {
            if (eeee.keyMap === ee.priceId) {
              res = { ...res, price: eeee.valueVi };
            }
          });
        }
      });
      // c.forEach(eee => {
      //   if(eee.key ===)
      // })
      return res;
    });

    console.log(nameDoctorList,"nameDoctorList");
    // console.log(c);
    // console.log(cac);
    // console.log(cac);
    const newList4 = cac.map((e) => {
      let value = {};
      newList2.forEach((f) => {
        if (e.doctorId === f.doctorId) {
          value = { ...e, count: f.count };
        }
      });
      return value;
    });
    const newList3 = newList2.map((e) => ({
      title: e.name,
      value: (e.count / listS3.length) * 100,
      color: this.random_bg_color(),
    }));
    const count = newList4.reduce(
      (sum, arr) => {
        const itemPrice = c.find((f) => f.keyMap === arr.priceId);
        if (itemPrice) {
          const price = itemPrice.valueVi;
          if (parseInt(arr.count) > 0) {
            sum.count += parseInt(arr.count);
            sum.Price += parseInt(price) * parseInt(arr.count);
          }
        }
        return sum;
      },
      { count: 0, Price: 0 }
    );
    return (
      <>
        {this.state.listS3 === [] ? (
          <div>Empty</div>
        ) : (
          <div>
            <TopChartDoctor count={count.Price} BenhNhan={count.count} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  margin: "20px 0",
                  height: "max-content",
                }}
              >
                {newList3.map((e) => (
                  <div
                    key={uniqueId()}
                    style={{
                      padding: "20px",
                      borderRadius: "10px",
                      boxShadow: " 0 0 1px 2px #888",
                    }}
                  >
                    <p>Bác sĩ : {e.title} </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span>Color :</span>
                      <div
                        style={{
                          background: e.color,
                          width: "40px",
                          height: "10px",
                        }}
                      ></div>
                    </div>
                    <p>
                      Tổng Số bệnh nhân :{" "}
                      {((e.value * listS3.length) / 100).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: "20px",
                  borderRadius: "20px",
                  border: "1px solid #888",
                }}
              >
                <p>Thống kê Tổng số đã khám Của Bác sĩ</p>
                <PieChart
                  style={{ width: "400px", height: "400px" }}
                  data={newList3}
                />
              </div>
            </div>
            { nameDoctorList[0] && <TableChart dataS3={nameDoctorList} />}
          </div>
        )}
      </>
    );
  }
}
export default ChartDoctorBottom;
