// localStorage.removeItem("empMockData");
document.addEventListener("DOMContentLoaded", function () {
  // MockData
  let localData =
    JSON.parse(localStorage.getItem("empMockData")) || mockEmployees;
  // console.log('localData', localData)
  const setLocalData = (data) => {
    localStorage.setItem("empMockData", JSON.stringify(data));
  };
  const searchInput = document.getElementById("search-input");
  searchInput?.addEventListener("keyup", function (e) {
    const sValue = e.target.value.trim();
    if (sValue.length > 0) {
      // console.log(sValue);
      const filteredName = localData.filter(
        (i) =>
          i.firstName.includes(sValue) ||
          i.lastName.includes(sValue) ||
          i.email.includes(sValue)
      );
      renderDataCards(filteredName);
    } else {
      renderDataCards(localData);
    }
  });

  const doSortByName = (e) => {
    const sortBy = e.target.value;
    // console.log(sortBy);
    if (sortBy === "firstname")
      localData.sort((a, b) => a.firstName.localeCompare(b.firstName));
    if (sortBy === "department")
      localData.sort((a, b) => a.department.localeCompare(b.department));
    if (sortBy === "") localData.sort((a, b) => a.id - b.id);
    // console.log(localData)
    renderDataCards(localData);
  };

  const renderDataCards = (list) => {
    // console.log("list :", list);
    const cardsBox = document.getElementById("data-cards-box");
    if (cardsBox) {
      cardsBox.innerHTML = "";
      list.forEach((emp) => {
        const content = `
    <div class="data-card">
        <h3>${emp.firstName} ${emp.lastName}</h3>
        <p>ID:
            <span>${emp.id}</span>
        </p>
        <p>Email:
            <span>${emp.email}</span>
        </p>
        <p>Department:
            <span>${emp.department}</span>
        </p>
        <p>Role:
            <span>${emp.role}</span>
        </p>
        <div class="edit-del-box">
            <button type="button" data-id="${emp.id}" id="edit-btn" class="edit-btn" onclick="location.href='form.html?editId=${emp.id}'">Edit</button>
            <button type="button" id="delete-btn" class="delete-btn" onclick="deleteCard(${emp.id})">Delete</button>
        </div>
    </div>`;
        cardsBox.innerHTML += content;
      });
    }
  };

  window.deleteCard = (id) => {
    const filteredList = localData.filter((each) => each.id !== id);
    localData = [...filteredList];
    setLocalData(localData);
    // console.log('fl' ,tempDataCards)
    renderDataCards(localData);
  };

  const pathname = window.location.pathname
    .split("/")
    ?.slice(-1)[0]
    ?.split(".")[0];
  // console.log('pathname', pathname)
  // Edit
  if (pathname === "form") {
    function getQueryParam(name) {
      console.log("1");
      const params = new URLSearchParams(window.location.search);
      //   console.log(params.get(name));
      return params.get(name);
    }
    const editId = getQueryParam("editId");
    let formTitle = document.getElementById("formTitle");
    // editing  existing data form
    if (editId) {
      formTitle.textContent = "Edit Employee";
      const emp = localData.find((emp) => emp.id === Number(editId));
      if (emp) {
        document.getElementById("empId").value = emp.id;
        document.getElementById("firstName").value = emp.firstName;
        document.getElementById("lastName").value = emp.lastName;
        document.getElementById("email").value = emp.email;
        document.getElementById("department").value = emp.department;
        document.getElementById("role").value = emp.role;
      } else {
        formTitle.textContent = "Add Employee";
      }

      // save
      const form = document.getElementById("employeeForm");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const empid = document.getElementById("empId").value;
        const fname = document.getElementById("firstName").value;
        const lname = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const department = document.getElementById("department").value;
        const role = document.getElementById("role").value;
        const formError = document.getElementById("errorMsg");
        // console.log("formError", formError);
        if (
          fname.trim() !== "" &&
          lname.trim() !== "" &&
          email.trim() !== "" &&
          department.trim() !== "" &&
          role.trim() !== "" &&
          /^[a-zA-Z0-9._%+-]+@(gmail|example)\.com$/.test(email.trim())
        ) {
          form.textContent = "";
          const empId = editId;
          // console.log("e", empId);

          const editedEmpData = {
            id: Number(empId) || 0,
            firstName: fname,
            lastName: lname,
            email: email,
            department: department,
            role: role,
          };
          // console.log(editedEmpData);
          console.log("saved");
          const filteredList = localData.map((each) => {
            return each.id === Number(empId) ? editedEmpData : each;
          });
          setLocalData(filteredList);
          // console.log(filteredList, localData);

          window.location.href = "index.html";
        } else {
          formError.textContent = "** Enter Valid Details";
        }
      });
    }
    // adding new emp data
    else {
      console.log("new data");
      const form = document.getElementById("employeeForm");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const fname = document.getElementById("firstName").value;
        const lname = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const department = document.getElementById("department").value;
        const role = document.getElementById("role").value;
        const formError = document.getElementById("errorMsg");
        // console.log("formError", formError);
        if (
          fname.trim() !== "" &&
          lname.trim() !== "" &&
          email.trim() !== "" &&
          department.trim() !== "" &&
          role.trim() !== "" &&
          /^[a-zA-Z0-9._%+-]+@(gmail|example)\.com$/.test(email.trim())
        ) {
          form.textContent = "";
          const empId = Date.now();
          // console.log("empid", empId);

          const newEmpData = {
            id: empId,
            firstName: fname,
            lastName: lname,
            email: email,
            department: department,
            role: role,
          };
          // console.log(newEmpData);
          console.log("saved");
          const newAddedEmpList = localData.push(newEmpData);
          // console.log(newAddedEmpList, localData);
          setLocalData(localData);

          window.location.href = "index.html";
        } else {
          formError.textContent = "** Enter Valid Details";
        }
      });
    }
  } else if (pathname !== "form") {
    renderDataCards(localData);
    const doSortByNameSelect = document.getElementById("sortByName");
    doSortByNameSelect.addEventListener("change", doSortByName);
  }
});
