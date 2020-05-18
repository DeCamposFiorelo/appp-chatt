const users=[]

//addusers, removeUser,getUser,getUserInRoom

const addUser=({ id, userName, roomName})=>{

    //validate the data
    if(!userName || !roomName){
        return{
            error:"Username and room are required!"
        }

    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.roomName === roomName && user.userName ===userName
    })

    //validate username
    if(existingUser){
        return{
            error:"Username is in use"
        }
    }
    //store user
    const user={id,userName,roomName}
    users.push(user)
    return{user}

}
const removeUser=(id)=>{
    const index = users.findIndex((user)=>user.id ===id)
    if(index!==1){
        return users.splice(index, 1)[0]
    }
}

const getUser=(id)=>{
    return users.find((user)=>user.id==id)
}
const getUserInRoom = (room)=>{
    return users.filter((user)=>user.roomName==room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}