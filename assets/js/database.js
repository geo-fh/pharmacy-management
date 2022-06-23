async function postData(url = '', params) {
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  }).catch(function (error) {
    console.log(error);
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function prepareData(details) {
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

function loadUser() {
  
}

function getDate(date) {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
}