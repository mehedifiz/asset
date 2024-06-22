import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import DefaultInput from "../../components/input/DefaultInput";
import DefaultLabel from "../../components/label/DefaultLabel";
import PageTitle from "../../components/pageTitle/PageTitle";
import SectionTitle from "../../components/sectionTitle/SectionTitle";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function JoinAsHR() {
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { createUser, setUser, updateUserProfile, loading } = useAuth();
  const [formLoading, setFormLoading] = useState(false);
  const [isImageValidated, setIsImageValidated] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setIsImageValidated(false);
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const dob = form.dob.value;
    let company_name = form.company_name.value.replace(/\s+/g, "");
    const packages = form.packages.value;
    const image = form.image.files[0];
    // const formData = new FormData();
    // formData.append("image", image);
    let formData = new FormData();

    // Image Size Validation
    if (image && image.size <= 1000 * 1024) {
      formData.append("image", image);
      setIsImageValidated(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Image Size Should Be Less or Equal 100 KB",
      });
      setFormLoading(false);
      return;
    }

    // Validation
    if (password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Please Enter A Password Of At Least 6 Characters",
      });
      return;
    } else if (!/[A-Z]/.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Please Enter A Password Of At Least 1 Uppercase Character",
      });
      return;
    } else if (!/[a-z]/.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Please Enter A Password Of At Least 1 Lowercase Character",
      });
      return;
    }
    company_name = company_name.toLowerCase();
    try {
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_HOSTING_KEY
        }`,
        formData
      );
      const usersInfo = {
        name: name,
        email: email,
        password: password,
        company_logo: data.data.display_url,
        dob: dob,
        company_name: company_name,
        packages: packages,
        role: "hr",
        payment_status: false,
      };
      const { data: users } = await axiosPublic.post("/users", usersInfo);
      if (users.insertedId) {
        await createUser(email, password);
        await updateUserProfile(name);
        setUser((prevUser) => {
          return { ...prevUser, displayName: name };
        });
        Swal.fire({
          icon: "success",
          title: "HR Created!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/payment");
      } else {
        Swal.fire({
          icon: "error",
          title: users.message,
        });
      }
      setFormLoading(false);
    } catch (error) {
      setFormLoading(false);
      const errorMessage = error.message
        .split("/")[1]
        .replace(/\)\./g, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
      Swal.fire({
        icon: "error",
        title: `${errorMessage}`,
      });
    }
  };

  return (
    <>
      <PageTitle title={"Join As HR Manager"} />
      <section className="template-container py-6">
        <div className="mx-auto text-center w-full lg:w-3/6 md:w-4/6">
          <div>
            <SectionTitle sectionTitle={"Join As HR Manager"} />
            {loading ||
              (formLoading && isImageValidated && (
                <p className="text-center text-red-600 text-3xl my-2">
                  Please wait...
                </p>
              ))}
            <form onSubmit={handleCreateUser} className="md:px-0 px-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <DefaultLabel labelName={"Full Name"} />
                  <DefaultInput
                    inputType={"text"}
                    inputName={"name"}
                    inputPlaceholder={"Full Name"}
                  />
                </div>
                <div>
                  <DefaultLabel labelName={"Company Name"} />
                  <DefaultInput
                    inputType={"text"}
                    inputName={"company_name"}
                    inputPlaceholder={"Company Name"}
                  />
                </div>

                <div>
                  <DefaultLabel labelName={"Select A Package"} />
                  <select
                    required
                    className="w-full border border-gray-300 p-3 rounded-md text-base font-normal"
                    name="packages"
                  >
                    <option value="" selected disabled>
                      Choose your package
                    </option>
                    <option value="basic">5 Members for $5</option>
                    <option value="standard">10 Members for $8</option>
                    <option value="premium">20 Members for $15</option>
                  </select>
                </div>
                <div>
                  <DefaultLabel labelName={"Email"} />
                  <DefaultInput
                    inputType={"email"}
                    inputName={"email"}
                    inputPlaceholder={"Email"}
                  />
                </div>
                <div>
                  <DefaultLabel labelName={"Password"} />
                  <DefaultInput
                    inputType={"password"}
                    inputName={"password"}
                    inputPlaceholder={"Password"}
                  />
                </div>
                <div>
                  <DefaultLabel labelName={"Data Of Birth"} />
                  <DefaultInput inputType={"date"} inputName={"dob"} />
                </div>
                <div>
                  <DefaultLabel labelName={"Company Logo"} />
                  <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      required
                      type="file"
                      name="image"
                      className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-50 file:text-primary
      hover:file:bg-blue-100
    "
                    />
                  </label>
                </div>
              </div>
              <PrimaryButton
                buttonType={"submit"}
                buttonName={"SignUp"}
                buttonTextColor={"text-white"}
                buttonBGColor={"bg-primary"}
              />
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default JoinAsHR;
