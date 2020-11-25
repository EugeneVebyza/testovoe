import '../css/style.css';

import IMask from 'imask';
import numeralize from 'numeralize-ru'

const element = document.getElementById('tel');
const maskOptions = {
  mask: '+{7} (000) 000 - 00 - 00'
};
const mask = IMask(element, maskOptions);
const wrapper = document.querySelector(".wrapper");
const formCalculator = document.querySelector(".formCalculator");
const formOrder = document.querySelector(".formOrder")
const length = document.querySelector(".length");
const height = document.querySelector(".height");
const lengthUnit = document.querySelector(".lengthUnit");
const heightUnit = document.querySelector(".heightUnit");
const material = document.querySelector(".material");

const prevPageBtn = document.querySelector(".prevPage");
const total = document.querySelector(".totalCost");

const check = document.querySelector("#defaultCheck1");

const orderDescription = document.querySelector(".orderDescription");

const popUp = document.querySelector(".popUp");

const closeBtn = document.querySelector(".close");

const nameInput = document.querySelector(".nameInput");

const ordererName = document.querySelector(".ordererName");

const mailInput = document.querySelector(".mailInput");

const ordererMail = document.querySelector(".ordererMail");

const telInput = document.querySelector(".telInput");

const ordererTel = document.querySelector(".ordererTel");

const req = document.querySelectorAll(".req")

const nextBtn = document.querySelector(".nextBtn")

const sendBtn = document.querySelector(".sendBtn")

function countFormatMetr(num){
  return numeralize.pluralize(num, 'метр', 'метра', 'метров');
}

const regName = new RegExp("^[A-zА-яЁё]+$");

const regMail = new RegExp("[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+")

// извините за кровь из глаз

function formValidate(){
  if(formCalculator.querySelectorAll('.valid').length===3)
  {nextBtn.classList.remove("nextBtnDisable")
   nextBtn.classList.add("nextBtnEnable")};

  if(formOrder.querySelectorAll('.valid').length===3)
  {sendBtn.classList.remove("sendBtnDisable")
  sendBtn.classList.add("sendBtnEnable")};

  for (let index = 0; index < req.length; index++){
    const input = req[index];
    input.closest(".container").classList.remove("valid")

    if (input.classList.contains("material")){
      if (material.value !== "0")
      input.closest(".container").classList.add("valid")
    }
      else if (input.value !== ""){
        if (input.classList.contains("nameInput")){
          if (regName.test(input.value))
          input.closest(".container").classList.add("valid")
        } 
      else if (input.classList.contains("mailInput")){
        if(regMail.test(input.value))
        input.closest(".container").classList.add("valid")
      }
      else if (input.classList.contains("telInput")){
        if(/[0-9]{11}/g.test(input.value.match(/\d/g).join(''))){
         input.closest(".container").classList.add("valid")
      }
      }
        else input.closest(".container").classList.add("valid")
    }

  }

}

function calculate(){
  const res = height.value * length.value * material.value + ((check.checked) ? 200 : 0);
  total.textContent = +res.toFixed(2);
  lengthUnit.textContent = countFormatMetr(length.value)
  heightUnit.textContent = countFormatMetr(height.value)
}

function getmaterial(value){
  switch (value) {
  case "400" : return "профнастил" 
  case "500" : return "модули"
  case "700" : return "бетон"
  case "200" : return "сетка"
  default : return}
}

function addErrors(form){
  const inputs = form.querySelectorAll(".form-control");

  for (let index = 0; index < inputs.length; index++){
    
    const input = inputs[index];
    input.closest(".container").classList.remove("invalid");

    if (!input.closest(".container").classList.contains("valid")){

      input.closest(".container").classList.add("invalid")
    }
  }

}

function nextPage(e){
  e.preventDefault();
  if (formCalculator.querySelectorAll('.valid').length===3){
    formCalculator.classList.add("cutDown");
    prevPageBtn.classList.remove("cutDown");
    formOrder.classList.remove("cutDown");
    orderDescription.innerHTML = `Вы укомплектовали забор <span style ="color:#458AE1" >длинной ${length.value} ${countFormatMetr(length.value)}</span>
    и <span style ="color:#458AE1">высотой ${height.value} ${countFormatMetr(height.value)}</span> 
    из материала <span style ="color:#458AE1">${getmaterial(material.value)}</span>  на сумму <span style ="color:#A10031"> ${total.textContent} &#8381;</span>`;
  }
  else{
    addErrors(formCalculator);
  }
}


function prevPage(){
  formOrder.classList.add("cutDown");
  formCalculator.classList.remove("cutDown");
  prevPageBtn.classList.add("cutDown");
}

async function formSubmit(e){
  e.preventDefault();
  const info = new FormData(formOrder);

  // let error = formValid(form);
  if (formOrder.querySelectorAll('.valid').length===3){
    let response = await fetch('sendmail.phps', {
      method: 'POST',
      body: FormData,
    })
    if (response.ok){
      formOrder.classList.add("cutDown");
      ordererName.textContent= `${nameInput.value},`
      ordererMail.textContent= `${mailInput.value}`
      ordererTel.textContent= `${telInput.value}`
      popUp.classList.remove("cutDown");
      prevPageBtn.classList.add("hide");
      closeBtn.classList.remove("cutDown");
    }
    else{ 
      console.log(response)
    }  
}
  else{
    addErrors(formOrder);
  }
}

function closePopUp(){
  wrapper.classList.add("cutDown");
}


formCalculator.addEventListener('input', calculate)

formCalculator.addEventListener('input', formValidate)

formOrder.addEventListener('input', formValidate)

formCalculator.addEventListener('submit', nextPage)

prevPageBtn.addEventListener('click', prevPage)

formOrder.addEventListener('submit', formSubmit)

closeBtn.addEventListener('click', closePopUp)