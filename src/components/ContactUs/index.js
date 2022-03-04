import React from "react";
import "./index.css";
import $ from "jquery";
import Swal from "sweetalert2";
import axios from "axios";


export class ContactUs extends React.Component {

    FormSubmit = e => {
        e.preventDefault();

        var Col_EmailId = $('#EmailId');
        var Col_Name = $('#Name');
        var Col_Message = $('#Message');

        var Err = false;
        if(Col_EmailId[0] == null || Col_Name[0] == null || Col_Message[0] == null)
        {
            Err = true;
            Swal.fire({
                title: 'Invalid Details',
                text: 'Please Refresh',
                confirmButtonText: 'Reload'
            }).then((result) => {
                window.location.load();
            });
        }
        else
        {
            if($.trim(Col_EmailId.val()) == "")
            {
                Err = true;
                Col_EmailId.css('outline', 'red solid 1px');
                Col_EmailId.focus();
            }
            else
            {
                Col_EmailId.css('outline', '');
            }

            if($.trim(Col_Name.val()) == "")
            {
                Err = true;
                Col_Name.css('outline', 'red solid 1px');
                Col_Name.focus();
            }
            else
            {
                Col_Name.css('outline', '');
            }

            if($.trim(Col_Message.val()) == "")
            {
                Err = true;
                Col_Message.css('outline', 'red solid 1px');
                Col_Message.focus();
            }
            else
            {
                Col_Message.css('outline', '');
            }
        }

        if(!Err)
        {
            Swal.fire({
                title: 'Updating Request',
                text: 'Please Wait...',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            Swal.showLoading();

            var formData = $('#Form').serialize();
            axios
                .post('http://localhost:3007/contact_us', formData)
                .then((resp) => {
                    Swal.close();
                    var json = resp['data'];

                    var Status = json['Status'];
                    if(Status == "Error")
                    {
                        Swal.fire({
                            icon: 'error',
                            title: 'Some Error Occurred',
                            text: 'Please Try Again Later'
                        });
                        console.error(e);
                    }
                    else
                    {
                        Swal.fire({
                            title: 'Request Submitted',
                            icon: 'success',
                            confirmButtonText: 'Okay'
                        }).then((result) => {
                            window.location.reload();
                        })
                    }
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Some Error Occurred',
                        text: 'Please Try Again Later'
                    });
                    console.error(err);
                });
        }
    }

    render() {
        return (
            <div className="ContactUsMainCol">
                <div className="ContactUsCol">
                    <h2>Contact Us</h2>
                    <form onSubmit={this.FormSubmit} id="Form">
                        <label>
                            <span>Email Id<i className="Required"></i></span>
                            <span>
                                <input required type="email" id="EmailId" name="EmailId" />
                            </span>
                        </label>
                        <label>
                            <span>Name<i className="Required"></i></span>
                            <span>
                                <input required type="text" id="Name" name="Name" />
                            </span>
                        </label>
                        <label>
                            <span>Message<i className="Required"></i></span>
                            <span>
                                <textarea required id="Message" name="Message" ></textarea>
                            </span>
                        </label>
                        <center>
                            <button>Update</button>
                        </center>
                    </form>
                </div>
            </div>
        );
    }
}