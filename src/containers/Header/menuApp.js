export const adminMenu = [
  {
    //quản lý người dùng
    name: "menu.admin.manage-user",
    menus: [
      {
        name: "menu.admin.crud",
        link: "/system/user-manage",
      },

      {
        name: "menu.admin.crud-redux",
        link: "/system/user-redux",
      },

      {
        name: "menu.admin.manage-doctor",
        link: "/system/manage-doctor",
        // subMenus: [
        //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
        //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
        // ]
      },

      // {
      //     name: 'menu.admin.manage-admin', link: '/system/user-admin'
      // },

      {
        //Quan ly ke hoach kham benh cua bac si
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        name: "menu.admin.chart-doctor",
        link: "/doctor/chart",
      },
    ],
  },
  {
    //quản lý phòng khám
    name: "menu.admin.clinic",
    menus: [
      {
        name: "Tạo Phòng khám",
        link: "/system/manage-clinic",
      },
      {
        name: "menu.admin.manage-clinic",
        link: "/system/edit-clinic",
      },
    ],
  },
  {
    //quản lý chuyên khoa
    name: "menu.admin.specialty",
    menus: [
      {
        name: "Tạo chuyên khoa",
        link: "/system/manage-specialty",
      },
      {
        name: "Quản lý chuyên khoa",
        link: "/system/edit-specialty",
      },
    ],
  },
  {
    //quản lý cẩm nang
    name: "menu.admin.handbook",
    menus: [
      {
        name: "menu.admin.manage-handbook",
        link: "/system/manage-handbook",
      },
      
    ],
  },
];

export const doctorMenu = [
  {
    name: "menu.admin.manage-user",
    menus: [
      {
        //Quản lý kê hoạch khám bệnh của bác sĩ
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        //Quản lý bệnh nhân khám bệnh của bác sĩ
        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      }
    ],
  },
];
