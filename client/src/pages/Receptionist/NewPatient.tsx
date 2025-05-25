import React from "react";
import { useState } from "react";


type DepartmentName =
  | "cardiology"
  | "neurology"
  | "orthopedics"
  | "pediatrics"
  | "general"
  | "emergency";

//we will be fetching these from database..so just filled dummyData for progress!
const departments: Record<DepartmentName, string[]> = {
  cardiology: ["Dr. Smith", "Dr. Patel"],
  neurology: ["Dr. Brain", "Dr. Watson"],
  orthopedics: ["Dr. Bones", "Dr. Andrews"],
  pediatrics: ["Dr. Kids", "Dr. Young"],
  general: ["Dr. House", "Dr. Adams"],
  emergency: ["Dr. Rush", "Dr. Speed"],
};

function NewPatient()
{
  const[patientData, setPatientData] = useState(
    {
      name : '',
      email : '',
      phone : '',
      gender : '',
      address : '',
      department : '',
      doctor : '',
      age : '',
      emergency : false
    }
  );
  return(
    <div className="mx-[10vw] mt-8">
      <div className="w-full border border-black rounded-none">
        <h2 className="text-[36px] leading-[45px] font-extrabold">New Patient</h2>
      </div>
      
      <div className="mt-2.5">
        <h1 className="text-[16px] leading-[24px] font-regular">Collect patient's name, email, phone number, date of birth, gender, and address. Display created at timestamp. Include a
        field to indicate if the patient is admitted to emergency, alongside the number of available beds.</h1>
      </div>

      {/*Emergency checkBox*/}
        <div className="mt-2.5">
          <label><input type="checkbox" checked={patientData.emergency}  onChange={(e) => setPatientData({...patientData, emergency: e.target.checked})}/>Emergency</label>
        </div>

      <form className="mt-0">
        
        <div className="w-[50vw] h-[88px] flex gap-x-4 items-center ">
          {/* Name */}
          <div className="w-[25vw]">
            <label>Name</label>
            <br/>
            <input type="text" name="name" value={patientData.name} onChange={(e) => setPatientData({...patientData, name: e.target.value})} placeholder="e.g RamBahadur Neupane"  className="border border-gray-400 rounded px-2 py-1 w-full"/>
          </div>

          {/*email*/}
          <div className="w-[25vw]">
            <label>Email</label>
            <br/>
            <input type="email" name="email" value={patientData.email} onChange={(e) => setPatientData({...patientData, email: e.target.value})} placeholder="e.g rambahadur@gmail.com"  className="border border-gray-400 rounded px-2 py-1 w-full"/>
          </div>
        </div>

        {/* Phone Number*/}
        <div>
          <label>Phone Number:</label>
          <br/>
          <input type="text" name="phone" value={patientData.phone} onChange={(e) => setPatientData({...patientData, phone: e.target.value})} placeholder="e.g +977 981-2345678"  className="border border-gray-400 rounded px-2 py-1 w-[50vw]"/>
        </div>

        {/*Gender*/}
        <div className="mt-2.5 w-full flex items-center gap-6" >
          <label>Gender:</label>
          <div className="flex justify-between w-full">
            <label className="flex items-center gap-2 w-full justify-center"> <input type="radio" name="male" value = "male" checked={patientData.gender === "male"} onChange={(e) => setPatientData({...patientData, gender: e.target.value})}/>Male</label>
            <label className="flex items-center gap-2 w-full justify-center"> <input type="radio" name="female" value = "female" checked={patientData.gender === "female"} onChange={(e) => setPatientData({...patientData, gender: e.target.value})}/>Female</label>
            <label className="flex items-center gap-2 w-full justify-center">  <input type="radio" name="others" value = "others" checked={patientData.gender === "others"} onChange={(e) => setPatientData({...patientData, gender: e.target.value})}/>Others</label>
          </div>
        </div>

        {/*Age*/}
        <div className="mt-2.5 w-[50vw]">
          <label>Age</label>
          <div className="w-full">  
            <input type="text" name="age" value={patientData.age}  onChange={(e) => setPatientData({...patientData, age: e.target.value})} placeholder="e.g 32" className="border border-gray-400 rounded px-2 py-1 w-[50vw]"/>
          </div>  
        </div>

        {/*Address*/}
        <div>
          <label>Address</label>
          <br/>
          <input type="text" name="address" value={patientData.address}  onChange={(e) => setPatientData({...patientData, address: e.target.value})} placeholder="e.g 28 kilo, Dhulikhel, Bagmati" className="border border-gray-400 rounded px-2 py-1 w-[50vw]"/>
        </div>


        {/*Department*/}
        <div>
          <label>Department</label>
          <br/>
          <select name="department" value={patientData.department} onChange={(e) => setPatientData({...patientData, department: e.target.value, doctor: ''})} className="border border-gray-400 rounded px-2 py-1 w-[50vw]">
            <option value="">Select Department</option>
              {Object.keys(departments).map((dept) =>(
                <option key={dept} value={dept}>{dept.charAt(0).toUpperCase() + dept.slice(1)}</option>
              ))}
          </select>
        </div>

        {/*Doctor*/}
        <div>
          <label>Doctor</label>
          <br/>
          <select name="doctor" value={patientData.doctor} onChange={(e) => setPatientData({...patientData, department: e.target.value})} disabled={!patientData.department} className="border border-gray-400 rounded px-2 py-1 w-[50vw]">
            <option value="">Select avilable Doctor</option>
            {patientData.department && departments[patientData.department as DepartmentName].map((doctor) =>(
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
        </div>
            
        <div className="mt-6 w-[50vw]">
          <button type="submit"  className="w-full bg-[#009963] text-white py-2 px-4 rounded-xl hover:bg-[#007f52] transition">
            Submit
          </button>
        </div>   

      </form>

    </div>
  );
}

export default NewPatient;