// Starting Point
main()
async function main(){
  await get_time_date()
  await fetch_all_data()
  await fetch_iata_data()
  await create_element()
  await insert_data_to_html()
}

// function to get date and time
var date, yyyy_Mon_dd, yyyy_mm_dd, hh_mm;
var a_d = 'false';
function get_time_date(){
  date = new Date();
  yyyy_Mon_dd = date.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
  document.getElementById('date').innerHTML = 'Date: ' + yyyy_Mon_dd;
  yyyy_mm_dd = date.toLocaleString('en-CA').substring(0, 10);
  hh_mm = ('0' + date.getHours()).substr(-2)  + ':' + date.getMinutes();
}

// function to fetch all flight data
var all_data, day_in_array;
async function fetch_all_data(){
  var response = await fetch('flight.php?date=' + yyyy_mm_dd + '&lang=en&cargo=false&arrival=' + a_d);
  // var response = await fetch('arrival-20230301.json');
  all_data =  await response.json();
  day_in_array = all_data.length;
}

// function to fetch data from iata.php
var iata_data;
async function fetch_iata_data(){
  var response = await fetch('iata.json');
  iata_data =  await response.json();
}

// function to replace the destination/origin from iata.json
function replace_iata_data(input_iata){
  var text;
  for (let i = 0; i < iata_data.length; i++) {
    if (input_iata ==  iata_data[i].iata_code){
      text = iata_data[i].municipality + ' (' + iata_data[i].name + ')';
      return text;
    }   
  }
}

// function to create the structure of each block of individual flight
var individual_flight, info_line, individual_content, span_e, text, node, top_10, total_flight, counter; // 0-9 only
top_10 = total_flight = 0;
function create_element(){
  for (let i=0; i<day_in_array; i++){
    for (let j=0; j<all_data[i].list.length; j++){
      individual_flight = document.createElement('div');
      individual_flight.className = 'individual_flight';
      document.getElementById('flight_data').appendChild(individual_flight);
  
      info_line = document.createElement('div');
      info_line.className = 'info_line_1';
      document.getElementsByClassName('individual_flight')[total_flight].appendChild(info_line);
    
      info_line = document.createElement('div');
      info_line.className = 'info_line_2';
      document.getElementsByClassName('individual_flight')[total_flight].appendChild(info_line);
    
      info_line = document.createElement('div');
      info_line.className = 'info_line_3';
      document.getElementsByClassName('individual_flight')[total_flight].appendChild(info_line);
    
      // Flight No
      individual_content = document.createElement('div');
      individual_content.id = 'Flight_No' + total_flight.toString() ;
      document.getElementsByClassName('info_line_1')[total_flight].appendChild(individual_content);      
      
      span_e = document.createElement('span');
      node = document.createTextNode("Flight No.: ");
      span_e.appendChild(node);
      document.getElementById('Flight_No'+ total_flight.toString()).appendChild(span_e);       
    
      // Scheduled Time
      individual_content = document.createElement('div');
      individual_content.id = 'Scheduled_Time' + total_flight.toString();
      document.getElementsByClassName('info_line_1')[total_flight].appendChild(individual_content);

      span_e = document.createElement('span');
      node = document.createTextNode("Scheduled Time: ");
      span_e.appendChild(node);
      document.getElementById('Scheduled_Time'+ total_flight.toString()).appendChild(span_e); 

      // Airport
      individual_content = document.createElement('div');
      individual_content.id = 'Airport' + total_flight.toString() ;
      document.getElementsByClassName('info_line_2')[total_flight].appendChild(individual_content);      
      
      span_e = document.createElement('span');
      if (a_d == 'false'){
        node = document.createTextNode("Destination (Airport):");
      }
      else if (a_d == 'true'){
        node = document.createTextNode("Origin (Airport):");
      }
      span_e.appendChild(node);
      document.getElementById('Airport'+ total_flight.toString()).appendChild(span_e);        
    
      // terminal_stand
      individual_content = document.createElement('div');
      individual_content.id = 'Terminal_Stand' + total_flight.toString() ;
      document.getElementsByClassName('info_line_3')[total_flight].appendChild(individual_content);

      span_e = document.createElement('span');
      if (a_d == 'false'){
        node = document.createTextNode("Terminal: ");
      }
      else if (a_d == 'true'){
        node = document.createTextNode("Parking Stand: ");
      }
      span_e.appendChild(node);
      document.getElementById('Terminal_Stand'+ total_flight.toString()).appendChild(span_e);       
    
      // Aisle Hall 
      individual_content = document.createElement('div');
      individual_content.id = 'Aisle_Hall' + total_flight.toString() ;
      document.getElementsByClassName('info_line_3')[total_flight].appendChild(individual_content);

      span_e = document.createElement('span');
      if (a_d == 'false'){
        node = document.createTextNode("Aisle: ");
      }
      else if (a_d == 'true'){
        node = document.createTextNode("Hall: ");
      }
      span_e.appendChild(node);
      document.getElementById('Aisle_Hall'+ total_flight.toString()).appendChild(span_e);
    
      // Gate Belt 
      individual_content = document.createElement('div');
      individual_content.id = 'Gate_Belt' + total_flight.toString() ;
      document.getElementsByClassName('info_line_3')[total_flight].appendChild(individual_content);

      span_e = document.createElement('span');
      if (a_d == 'false'){
        node = document.createTextNode("Gate: ");
      }
      else if (a_d == 'true'){
        node = document.createTextNode("Belt: ");
      }
      span_e.appendChild(node);
      document.getElementById('Gate_Belt'+ total_flight.toString()).appendChild(span_e);
    
    // status
      individual_content = document.createElement('div');
      individual_content.id = 'Status' + total_flight.toString() ;
      document.getElementsByClassName('info_line_3')[total_flight].appendChild(individual_content);

      span_e = document.createElement('span');
      node = document.createTextNode("Status: ");
      span_e.appendChild(node);
      document.getElementById('Status'+ total_flight.toString()).appendChild(span_e);

      total_flight += 1;
  
      if (all_data[i].date < yyyy_mm_dd){ // previous day
        individual_flight.classList.add('individual_flight_early'); 
      }
      else if (all_data[i].date >= yyyy_mm_dd && all_data[i].list[j].time < hh_mm){  // early today
        individual_flight.classList.add('individual_flight_early'); 
      }
      else if (all_data[i].date >= yyyy_mm_dd && all_data[i].list[j].time >= hh_mm && top_10 <=10){  // show current
        individual_flight.classList.add('individual_flight_current'); 
        top_10 += 1;
      }
      else if (all_data[i].date >= yyyy_mm_dd && all_data[i].list[j].time >= hh_mm && top_10 >10){  // later
        individual_flight.classList.add('individual_flight_later'); 
      }
    }
  } 
}

// function to put the fetch data in html
function insert_data_to_html(){
  total_flight = 0;
  if (a_d == 'false'){ // departure
    for (let i=0; i<day_in_array; i++){
      for (let j=0; j<all_data[i].list.length; j++){
        // time
        text = all_data[i].list[j].time;
        node = document.createTextNode(text);
        document.getElementById('Scheduled_Time' + total_flight.toString()).appendChild(node);
        // flight number
        text = "";
        for (let k = 0; k < all_data[i].list[j].flight.length; k++) {
          text += all_data[i].list[j].flight[k].no + '   ';
        }
        node = document.createTextNode(text);
        document.getElementById('Flight_No'+ total_flight.toString()).appendChild(node);
        // Airport
        var br = document.createElement("br");
        document.getElementById('Airport' + total_flight.toString()).appendChild(br);
        text = "";
        for (let k = 0; k < all_data[i].list[j].destination.length; k++) {
          text += replace_iata_data(all_data[i].list[j].destination[k]) + '   ';
        }
        node = document.createTextNode(text);
        document.getElementById('Airport' + total_flight.toString()).appendChild(node);
        // terminal
        text = all_data[i].list[j].terminal;
        node = document.createTextNode(text);
        document.getElementById('Terminal_Stand' + total_flight.toString()).appendChild(node);
        // Aisle
        text = all_data[i].list[j].aisle;
        node = document.createTextNode(text);
        document.getElementById('Aisle_Hall' + total_flight.toString()).appendChild(node);
        // gate
        text = all_data[i].list[j].gate;
        node = document.createTextNode(text);
        document.getElementById('Gate_Belt' + total_flight.toString()).appendChild(node);
        // status
        text = all_data[i].list[j].status;
        node = document.createTextNode(text);
        document.getElementById('Status' + total_flight.toString()).appendChild(node);

        total_flight += 1;
      }  
    }
  }
  else{ // arrival
    for (let i=0; i<day_in_array; i++){
      for (let j=0; j<all_data[i].list.length; j++){
        // time
        text = all_data[i].list[j].time;
        node = document.createTextNode(text);
        document.getElementById('Scheduled_Time' + total_flight.toString()).appendChild(node);
        // flight number
        text = "";
        for (let k = 0; k < all_data[i].list[j].flight.length; k++) {
          text += all_data[i].list[j].flight[k].no + '   ';
        }
        node = document.createTextNode(text);
        document.getElementById('Flight_No'+ total_flight.toString()).appendChild(node);
        // Airport
        var br = document.createElement("br");
        document.getElementById('Airport' + total_flight.toString()).appendChild(br);
        text = "";
        for (let k = 0; k < all_data[i].list[j].origin.length; k++) {
          text += replace_iata_data(all_data[i].list[j].origin[k]) + '   ';
        }
        node = document.createTextNode(text);
        document.getElementById('Airport' + total_flight.toString()).appendChild(node);
        // stand
        text = all_data[i].list[j].stand;
        node = document.createTextNode(text);
        document.getElementById('Terminal_Stand' + total_flight.toString()).appendChild(node);
        // hall
        text = all_data[i].list[j].hall;
        node = document.createTextNode(text);
        document.getElementById('Aisle_Hall' + total_flight.toString()).appendChild(node);
        // belt
        text = + all_data[i].list[j].baggage;
        node = document.createTextNode(text);
        document.getElementById('Gate_Belt' + total_flight.toString()).appendChild(node);
        // status
        text = all_data[i].list[j].status;
        node = document.createTextNode(text);
        document.getElementById('Status' + total_flight.toString()).appendChild(node);

        total_flight += 1;
      }
    }
  }
}

// function to change between arrival and departure
var checkbox = document.querySelector("input[type='checkbox']");
document.getElementById('d').style.textDecoration = 'underline';
function f_toogle (){
  if (checkbox.checked) {
    document.getElementById('change').innerHTML = 'Arrival Information';
    document.getElementById('d').style.textDecoration = 'none';
    document.getElementById('a').style.textDecoration = 'underline';
    document.getElementById('flight_data').innerHTML = "";
    a_d = 'true';
  } 
  else {
    document.getElementById('change').innerHTML = 'Departure Information'; 
    document.getElementById('a').style.textDecoration = 'none';
    document.getElementById('d').style.textDecoration = 'underline';
    document.getElementById('flight_data').innerHTML = "";
    a_d = 'false';
  }
  top_10 = 0;
  total_flight = 0;
  main();
};
checkbox.addEventListener('change', f_toogle);

// load all earlier flights of today + existing 
var load_early = document.getElementById('orange');
function f_load_early (){
  var elements = document.getElementsByClassName('individual_flight_early');
  for(var i = 0; i < elements.length; i++){
    elements[i].style.display = 'block';
  }
};
load_early.addEventListener('click', f_load_early);

// existing + load all upcoming flights
var load_more = document.getElementById('green');
function f_load_more (){
  var elements = document.getElementsByClassName('individual_flight_later');
  for(var i = 0; i < elements.length; i++){
    elements[i].style.display = 'block';
  }
};
load_more.addEventListener('click', f_load_more);