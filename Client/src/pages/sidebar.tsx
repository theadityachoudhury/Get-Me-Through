import React from "react";

import {

  MdOutlineSettings,
  MdOutlineLogout,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";

import { 
    HiOutlineTruck,
    HiOutlineHome,
    HiOutlinePresentationChartLine,
} from "react-icons/hi2";

export default function SideNavbar() {
    return (
      <div>
        
          <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
            <div className="flex flex-col justify-start item-center">
              <h1 className="text-3xl font-semibold text-center cursor-pointerfont-bold text-orange-400 border-b border-gray-100 pb-4 w-full">
                NR Sales and Marketing
              </h1>
              <div className=" my-4 border-b border-gray-100 pb-4">
                
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-400 p-2 rounded-md group cursor-pointer m-auto">
                  <HiOutlineHome className="text-3xl text-gray-800 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                    Dashboard
                  </h3>
                </div>
           
                
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-400 p-2 rounded-md group cursor-pointer m-auto">
                  <HiOutlineTruck className="text-3xl text-gray-800 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                    Vehicle
                  </h3>
                </div>
                <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-400 p-2 rounded-md group cursor-pointer m-auto">
                  <HiOutlinePresentationChartLine className="text-3xl text-gray-800 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                    Stonechip
                  </h3>
                </div>
                <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-400 p-2 rounded-md group cursor-pointer m-auto">
                  <HiOutlinePresentationChartLine className="text-3xl text-gray-800 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                    Analytics
                  </h3>
                </div>
              </div>
              {/* setting  */}
              <div className=" my-4 border-b border-gray-100 pb-4">
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-orange-400 p-2 rounded-md group cursor-pointer m-auto">
                  <MdOutlineSettings className="text-2xl text-gray-800 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                    Settings
                  </h3>
                </div>
                <div className="flex justify-start items-center gap-4 pl-5 hover:bg-orange-400 p-2 rounded-md group cursor-pointer m-auto">
                  <CgProfile className="text-2xl text-gray-800 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                    Profile
                  </h3>
                </div>
              </div>
              {/* logout */}
              <div className=" my-4">
                <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200  hover:bg-orange-400 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <MdOutlineLogout className="text-2xl text-gray-800 group-hover:text-white " />
                  <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                    Logout
                  </h3>
                </div>
              </div>
            </div>
          </div>

      </div>
    );
  }
  
 
