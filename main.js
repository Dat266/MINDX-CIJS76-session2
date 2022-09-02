const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const listContact = $(".contact");
const fieldName = $(".sub-name");
const fieldPhone = $(".sub-phone");
const fieldSearch = $(".sub-search");
const btnAdd = $(".btn-1");
const btnSearch = $(".btn-2");
const btnDelete = $(".btn-3");

// hàm khởi chạy

const runApp = () => {
	addContact();
	renderContact();
	searchContact();
	deleteDuplicateContact();
};

runApp();

// các hàm chờ xử lí

// 1. hàm lấy data trên local

function getStore(key) {
	return JSON.parse(localStorage.getItem(key) || []);
}

// 2. hàm tạo data trên local

function setStore(key, data) {
	return localStorage.setItem(
		key,
		JSON.stringify([...(getStore(key) || []), data])
	);
}

// 3. hàm delete data trên local

function removeStore(key) {
	return localStorage.removeItem(key);
}

//4. hàm update local

function updateStore(key, data) {
	localStorage.removeItem(key);
	return localStorage.setItem(key, JSON.stringify(data));
}
//5. hàm xóa local

//6. hàm render list contact

function mapElement(data) {
	const emty = getStore("contact");
	if (data == null || emty == "")
		return ` 
  <div class="item" style="background-color:#fff;justify-content: center;">
    Danh bạ đang trống
  </div>
`;

	const htmls = data.map((course, index) => {
		return `
  <div class="item" id=${index}>
    <div class="item__header">${course.name}</div>
    <div class="item__phone">${course.phone}</div>
		<i onclick='deleteOneContact(this)' class="bi bi-trash" id="trash"></i>
  </div>
  `;
	});

	return htmls.join(" ");
}

// hàm thêm contact

function addContact() {
	btnAdd.onclick = function (e) {
		e.preventDefault();
		const name = fieldName.value;
		const phone = fieldPhone.value;
		if (name == "" || phone == "") return alert("Vui lòng nhập thông tin");
		const user = {
			name,
			phone,
		};
		setStore("contact", user);
		renderContact();
		fieldPhone.value = "";
		fieldName.value = "";
		fieldName.focus();
	};
}

// hàm render contact list

function renderContact() {
	const data = getStore("contact");
	const htmls = mapElement(data);
	listContact.innerHTML = htmls;
}

// hàm tim kiếm liên hệ

function searchContact() {
	btnSearch.onclick = function (e) {
		e.preventDefault();
		const arr = [];
		const data = getStore("contact");
		const search = fieldSearch.value;
		for (let i = 0; i < data.length; i++) {
			if (data[i].name.includes(search) == true) {
				arr.push(data[i]);
			}
		}
		const htmls = mapElement(arr);
		listContact.innerHTML = htmls;
	};
}

// hàm xóa liên hệ trùng nhau

function deleteDuplicateContact() {
	btnDelete.onclick = function (e) {
		e.preventDefault();
		const data = getStore("contact");
		var obj = {};
		var newArr = [];
		for (let i = 0; i < data.length; i++) {
			if (!obj[data[i].name]) {
				obj[data[i].name] = 1;
				newArr.push({ name: data[i].name, phone: data[i].phone });
			}
		}
		removeStore("contact");
		localStorage.setItem("contact", JSON.stringify(newArr));
		renderContact();
	};
}

// hàm xóa 1 liên hệ

function deleteOneContact(x) {
	const parent = x.parentElement;
	const data = getStore("contact");
	const result = data.filter((item, index) => index != parent.id);
	updateStore("contact", result);
	renderContact();
}
