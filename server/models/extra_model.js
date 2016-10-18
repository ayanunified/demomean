/////////////////////////////////////////////////////////////
/////////////////SERVICE FOR ROLES LIST/////
///////////////////////////////////////////////////////////
PublicVar.getRolesList = function(req, res, next) {
    roles_info(res, {}, function(returned_list) {


        var sel_q = [];
        for (j = 0, p = 0; j < returned_list.length; j++) {
            var privileges_arr = returned_list[j].role_privilege;
            sel_q = [];
            for (i = 0; i < privileges_arr.length; i++) {

                var ids = {};
                ids._id = parseInt(privileges_arr[i]);

                sel_q.push(ids);
            }
            var fetchCriteria = {
                $or: sel_q
            };





            privileges_info(res, fetchCriteria, function(ret_data) {
                if (typeof returned_list[p] != 'undefined') {
                    returned_list[p].role_privilege = ret_data;
                    p++;
                }
                if (p == returned_list.length) {
                    return res.send({
                        status: 1,
                        msg: "Roles Fetched",
                        list: returned_list
                    });
                }


            });


        }





    });
}
