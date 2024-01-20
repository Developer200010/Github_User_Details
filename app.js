var dataLimit=10;
var originalname='Abhisek0721';
var form= document.getElementById("myform");
form.addEventListener("submit", function(e){
    e.preventDefault() //prevent form auto submission of form.
    var search = document.getElementById('search').value;
    console.log(search)
    originalname=search.split(' ').join('');
    defaultRender()
    console.log("trigger", originalname)
})

function defaultRender(){
    if(!originalname){
        originalname="Abhisek0721"
    }
    if(originalname==="Abhisek0721" && get_user_data()){
        let data= get_user_data();
        after_data_fetch(originalname,data);
        fetchRepo(1,originalname)
    }else{
        fetch("https://api.github.com/users/"+originalname)
        .then((result)=>result.json())
        .then((data)=>{
            // console.log(data)
            if(originalname==="Abhisek0721"){
                store_user_data(originalname,data);
            }
           after_data_fetch(originalname,data);
           fetchRepo(1,originalname)
        })
        
    }
   
}

function after_data_fetch(originalname, data){
    removeLoader();
    
    document.getElementById('img').innerHTML=`
    <img class="img" src="${data.avatar_url}"/>        
    `
    document.getElementById("username").textContent=data.login;
    document.getElementById("bio").textContent=data.bio;
    document.getElementById("location").textContent=data.location;
    document.getElementById("userurl").innerHTML=`
    <a href="${data.html_url}" class="font" target="_blank"> <i class="fa-solid fa-link"></i> ${data.html_url}</a>
    `
    // document.getElementById("totalrepos").textContent=data.public_repos;
    const totalRepo=data.public_repos;
    let num_of_page=totalRepo/dataLimit;
    if(num_of_page%1!==0){
        num_of_page=num_of_page-num_of_page%1 +1;
    }
    var pageNumber='';
    for(var i=1;i<=num_of_page;i++){
        pageNumber += `<span onclick="fetchRepo(${i},'${originalname}')">${i}</span>`
    }
    document.getElementById('pagination').innerHTML=pageNumber;
    console.log(originalname,"name")
    
}


function fetchRepo(pageNum=1,originalname="Abhisek0721",dataLimit=10){
   document.querySelector("#repo").innerHTML=`
    <div class="text center">Loading...</div>
    `;
    if(originalname==="Abhisek0721" && get_repo_data()){
        document.querySelector("#repo").innerHTML=get_repo_data();
        console.log("repos fetching1")
        return;
    } 
    console.log('fetching repo2')
    fetch(`https://api.github.com/users/${originalname}/repos?per_page=${dataLimit}&page=${pageNum}`)
    .then((response)=>response.json())
    .then(async (data)=>{
        console.log(data)
      
        var repos =" ";
        for(var eachRepo of data){
            let allLanguages=await fetchAllLanguages(originalname,eachRepo?.name);
            allLanguages=Object.keys(allLanguages);
    
            let repo_lan='';

            for(var lan of allLanguages){
                console.log(lan)   
                repo_lan += ` <div class="fonts">${lan}</div>`
                    
            }
            // console.log(repo_lan)
            // console.log(allLanguages,"languages")

            repos += `<div class="cards fonts  text-center">${eachRepo?.name}   
            ${repo_lan}         
            <div class="des fonts d-inline-block text-truncate" style="max-width:90%;">${eachRepo?.description}</div>
            </div>
           
            `;
            // document.querySelector('#repo').appendChild(repos)
        }
       if(originalname==="Abhisek0721" && !get_repo_data()){
        store_repo_data(originalname,repos);
       }
        document.querySelector("#repo").innerHTML=repos;
    })

}
defaultRender()

async function fetchAllLanguages(originalname, repo_name){
  let data = await fetch(`https://api.github.com/repos/${originalname}/${repo_name}/languages`)
  .then((result)=>result.json());
   return data
}

function store_user_data(originalname,data){
  localStorage.setItem(originalname,JSON.stringify(data));   
}
 
function get_user_data(originalname="Abhisek0721"){
    let data= localStorage.getItem(originalname)
    return JSON.parse(data);
}

function store_repo_data(originalname,repos){
    localStorage.setItem(`${originalname}-repo`,repos)
}
function get_repo_data(originalname="Abhisek0721"){
    let repo=localStorage.getItem(`${originalname}-repo`);
    return repo;
}