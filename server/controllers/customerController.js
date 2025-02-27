const Customer = require("../models/Customer");
const mongoose = require("mongoose")


// get homepage
// exports.homepage = async (req,res)=>{

//   const messages = await req.flash("info");

//     const locals = {
//         title :"Nodejs",
//         description:"free nodejs"
//     }

//     try {
//       // find from the model
//       const customers = await Customer.find({}).limit(22);
//       res.render('index', { locals, messages, customers } );
//    }    
//    catch (error) {
//      console.log(error);
//    }
//     // res.render("index",{locals,messages});
// }


exports.homepage = async (req,res)=>{

  const messages = await req.flash("info");

    const locals = {
        title :"Nodejs",
        description:"free nodejs"
    }

    // for flash messages
    // page recored limits are 5
    let perPage = 8;
    let page = req.query.page || 1;

    try {
      // find from the model
      const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();


      const count = await Customer.countDocuments({});


      res.render("index", {
        locals,
        customers,
        current: page,
        pages: Math.ceil(count / perPage),
        messages,
      });
   }    
   catch (error) {
     console.log(error);
   }
    // res.render("index",{locals,messages});
}


// ----------------------------------------------------------------------------------------------------------



exports.about = async (req, res) => {
  const locals = {
    title: "About",
    description: "Free NodeJs User Management System",
  };

  try {
    res.render("about", locals);
  } catch (error) {
    console.log(error);
  }
};




// ----------------------------------------------------------------------------------------------------------



// get addcustomer
exports.addCustomer = async (req,res)=>{
    const locals = {
        title :"Add new customer",
        description:"free nodejs"
    }
          
    // view page
    res.render("customer/add",locals);
}




// ----------------------------------------------------------------------------------------------------------







// get postcustomer(after adding details)
exports.postCustomer = async (req, res) => {
    console.log(req.body);
  
    const newCustomer = new Customer({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      details: req.body.details,
      tel: req.body.tel,
      email: req.body.email,
    });
  
    try {
      await Customer.create(newCustomer);
      await req.flash("info", "New customer has been added.");
  
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };




// ----------------------------------------------------------------------------------------------------------


// on clicking eye on dashboard getting customer data

exports.view = async (req, res) => {
  try {
    // find by id
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("customer/view", {
      locals,
      customer,  //finded user
    });
  } catch (error) {
    console.log(error);
  }
};


// ----------------------------------------------------------------------------------------------------------


// on clicking pencil on dashboard edit customer data
exports.edit = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
      title: "Edit Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("customer/edit", {
      locals,
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};



// ----------------------------------------------------------------------------------------------------------


// on clicking pencil on dashboard edit customer data after editing
exports.editPost = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      updatedAt: Date.now(),
    });
    await res.redirect(`/edit/${req.params.id}`);

    console.log("redirected");
  } catch (error) {
    console.log(error);
  }
};



// ----------------------------------------------------------------------------------------------------------


// on clicking pencil on dashboard edit customer data after editing delete the record

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};


// ----------------------------------------------------------------------------------------------------------



exports.searchCustomers = async (req, res) => {
  const locals = {
    title: "Search Customer Data",
    description: "Free NodeJs User Management System",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      customers,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};



// store any search req
// remove speacialcharacter and convert into simple string (abc@123 ---> abc123)

    // firstname matches to the regexp generated from searchNoSpecialChar (Abc --> abc) i flag make it case insensitive