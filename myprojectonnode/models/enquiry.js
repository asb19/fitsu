var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var Enquiries=new Schema(
{
	email:String,
	name:String,
	phone:String,
	message:String
});
mongoose.model('fitdb',Enquiries);