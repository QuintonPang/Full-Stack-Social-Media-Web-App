module.exports = (sequelize,DataTypes) => {
    const Posts = sequelize.define("Posts",{
        title:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        postText:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    })

    Posts.associate = (models) =>{
        Posts.hasMany(models.Comments,{
            onDelete:"cascade", // when a post is deleted, every comment associated to it will be deleted
        })

        Posts.hasMany(models.Likes,{
            onDelete:"cascade"
        })
    }
    return Posts
}