// src/features/profile/ProfilePage.js
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../redux/slices/profileSlice';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Phone, Mail, MapPin, Heart, Clock, 
  DollarSign, AlertCircle, Camera, Save, 
  UserCircle, Calendar, Droplets, AlertTriangle, CheckCircle
} from 'lucide-react';
import { updateUser } from '../../redux/slices/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { data: profile, loading, error } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, formState: { isDirty, errors } } = useForm();

  const [activeTab, setActiveTab] = useState('general');
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const formData = {
        username: profile.user?.username,
        email: profile.user?.email,
        phone_number: profile.phone_number,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        profile_picture: profile.profile_picture,
        bio: profile.bio,
        emergency_contact: profile.emergency_contact,
        emergency_phone: profile.emergency_phone,
        license_number: profile.license_number,
        qualifications: profile.qualifications,
        patient: {
          date_of_birth: profile.patient?.date_of_birth,
          gender: profile.patient?.gender,
          blood_type: profile.patient?.blood_type,
        },
        doctor: {
          specialty: profile.doctor?.specialty?.id,
          experience_years: profile.doctor?.experience_years,
          consultation_fee: profile.doctor?.consultation_fee,
        }
      };
      reset(formData);
      setProfilePic(profile.profile_picture);
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        profile_picture: data.profile_picture[0],
      };
      
      const result = await dispatch(updateProfile(formData)).unwrap();
      
      // Update local profile picture if new one was uploaded
      if (data.profile_picture && data.profile_picture[0]) {
        setProfilePic(URL.createObjectURL(data.profile_picture[0]));
      }
      
      // Update auth state with new profile status
      dispatch(updateUser({ profile_complete: result.profile_complete }));
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 p-4 rounded-lg transition-all ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      } w-full sm:w-auto justify-center`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  const InputField = ({ 
    icon: Icon, 
    label, 
    register, 
    name, 
    type = "text", 
    required = false,
    error,
    ...props 
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          className={`block w-full pl-10 pr-3 py-2.5 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
          bg-white shadow-sm text-gray-900`}
          {...register(name)}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-6xl mx-auto">
        {!auth.user?.profile_complete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg"
          >
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Complete Your Profile
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please complete your profile to access all features. 
                    Required fields are marked with an asterisk (*).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {auth.user?.profile_complete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg"
          >
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Profile Complete
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your profile is complete! You now have full access to all features.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            {error.message || 'Failed to load profile'}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
              {profilePic ? (
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-white font-bold">
                  {profile?.user?.username?.charAt(0)}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer">
              <Camera size={20} className="text-gray-600" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                {...register('profile_picture')}
                onChange={handleProfilePicChange}
              />
            </label>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{profile?.user?.username}</h1>
          <p className="text-gray-500 mt-2">{profile?.user?.email}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {profile?.user?.role}
            </span>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b">
            <TabButton id="general" label="General" icon={User} />
            {auth.user?.role === 'PATIENT' && (
              <TabButton id="medical" label="Medical Info" icon={Heart} />
            )}
            {auth.user?.role === 'DOCTOR' && (
              <TabButton id="professional" label="Professional" icon={Clock} />
            )}
            <TabButton id="emergency" label="Emergency" icon={AlertCircle} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    icon={User} 
                    label="Username" 
                    register={register} 
                    name="username"
                    required
                    error={errors.username}
                  />
                  <InputField 
                    icon={Mail} 
                    label="Email" 
                    type="email" 
                    register={register} 
                    name="email"
                    required
                    error={errors.email}
                  />
                  <InputField 
                    icon={Phone} 
                    label="Phone Number" 
                    register={register} 
                    name="phone_number"
                    required
                    error={errors.phone_number}
                  />
                  <InputField 
                    icon={MapPin} 
                    label="Address" 
                    register={register} 
                    name="address"
                    required
                    error={errors.address}
                  />
                  <InputField 
                    icon={MapPin} 
                    label="City" 
                    register={register} 
                    name="city"
                    required
                    error={errors.city}
                  />
                  <InputField 
                    icon={MapPin} 
                    label="Country" 
                    register={register} 
                    name="country"
                    required
                    error={errors.country}
                  />
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      {...register('bio')}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'medical' && auth.user?.role === 'PATIENT' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    icon={Calendar} 
                    label="Date of Birth" 
                    type="date" 
                    register={register} 
                    name="patient.date_of_birth"
                    required
                    error={errors.patient?.date_of_birth}
                  />
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('patient.gender', { required: 'Gender is required' })}
                        className={`block w-full pl-10 pr-3 py-2.5 border ${
                          errors.patient?.gender ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>
                    {errors.patient?.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.patient.gender.message}</p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Droplets className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('patient.blood_type', { required: 'Blood type is required' })}
                        className={`block w-full pl-10 pr-3 py-2.5 border ${
                          errors.patient?.blood_type ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="">Select Blood Type</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    {errors.patient?.blood_type && (
                      <p className="mt-1 text-sm text-red-600">{errors.patient.blood_type.message}</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'professional' && auth.user?.role === 'DOCTOR' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    icon={Heart} 
                    label="Specialty" 
                    register={register} 
                    name="doctor.specialty"
                    required
                    error={errors.doctor?.specialty}
                  />
                  <InputField 
                    icon={Clock} 
                    label="Experience (years)" 
                    type="number" 
                    register={register} 
                    name="doctor.experience_years"
                    required
                    error={errors.doctor?.experience_years}
                  />
                  <InputField 
                    icon={DollarSign} 
                    label="Consultation Fee" 
                    type="number" 
                    register={register} 
                    name="doctor.consultation_fee"
                    required
                    error={errors.doctor?.consultation_fee}
                  />
                  <InputField 
                    icon={Heart} 
                    label="License Number" 
                    register={register} 
                    name="license_number"
                    required
                    error={errors.license_number}
                  />
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualifications <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('qualifications', { required: 'Qualifications are required' })}
                      rows="3"
                      className={`w-full p-3 border ${
                        errors.qualifications ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.qualifications && (
                      <p className="mt-1 text-sm text-red-600">{errors.qualifications.message}</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'emergency' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    icon={User} 
                    label="Emergency Contact" 
                    register={register} 
                    name="emergency_contact"
                    required={auth.user?.role === 'PATIENT'}
                    error={errors.emergency_contact}
                  />
                  <InputField 
                    icon={Phone} 
                    label="Emergency Phone" 
                    register={register} 
                    name="emergency_phone"
                    required={auth.user?.role === 'PATIENT'}
                    error={errors.emergency_phone}
                  />
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!isDirty || loading}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg
                         hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 font-medium shadow-lg"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;