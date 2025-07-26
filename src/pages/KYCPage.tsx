import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Shield, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface KYCFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  occupation: string;
  sex: string;
  maritalStatus: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ssn: string;
  idNumber: string;
  phoneNumber: string;
  alternativePhone: string;
  emailAddress: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
}

const KYCPage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<KYCFormData>();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const onSubmit = async (data: KYCFormData) => {
    console.log('KYC Data:', data);
    
    setLoading(true);
    try {
      await updateProfile({
        kyc_data: data,
        kyc_status: 'pending'
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('KYC submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Identity Verification</h1>
          <p className="text-gray-400">Complete your KYC to unlock all banking features</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep} of 3</span>
            <span className="text-sm text-gray-400">{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 rounded-xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    {...register('firstName', { required: 'First name is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    {...register('lastName', { required: 'Last name is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.dateOfBirth && <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Occupation</label>
                  <input
                    {...register('occupation', { required: 'Occupation is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.occupation && <p className="text-red-400 text-sm mt-1">{errors.occupation.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sex</label>
                  <select
                    {...register('sex', { required: 'Sex is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.sex && <p className="text-red-400 text-sm mt-1">{errors.sex.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Marital Status</label>
                  <select
                    {...register('maritalStatus', { required: 'Marital status is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.maritalStatus && <p className="text-red-400 text-sm mt-1">{errors.maritalStatus.message}</p>}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Contact & Address Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
                  <input
                    {...register('address', { required: 'Address is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>}
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                    <input
                      {...register('state', { required: 'State is required' })}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ZIP Code</label>
                    <input
                      {...register('zipCode', { required: 'ZIP code is required' })}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {errors.zipCode && <p className="text-red-400 text-sm mt-1">{errors.zipCode.message}</p>}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">SSN</label>
                    <input
                      type="password"
                      {...register('ssn', { required: 'SSN is required' })}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="XXX-XX-XXXX"
                    />
                    {errors.ssn && <p className="text-red-400 text-sm mt-1">{errors.ssn.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Driver's License / ID Number</label>
                    <input
                      {...register('idNumber', { required: 'ID number is required' })}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {errors.idNumber && <p className="text-red-400 text-sm mt-1">{errors.idNumber.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      {...register('phoneNumber', { required: 'Phone number is required' })}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alternative Phone Number</label>
                    <input
                      type="tel"
                      {...register('alternativePhone')}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      {...register('emailAddress', { required: 'Email is required' })}
                      className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {errors.emailAddress && <p className="text-red-400 text-sm mt-1">{errors.emailAddress.message}</p>}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Emergency Contact & Document Upload</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Next of Kin Name</label>
                  <input
                    {...register('nextOfKinName', { required: 'Next of kin name is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.nextOfKinName && <p className="text-red-400 text-sm mt-1">{errors.nextOfKinName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Next of Kin Phone Number</label>
                  <input
                    type="tel"
                    {...register('nextOfKinPhone', { required: 'Next of kin phone is required' })}
                    className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  {errors.nextOfKinPhone && <p className="text-red-400 text-sm mt-1">{errors.nextOfKinPhone.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Document Upload</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 mb-2">Upload Driver's License (Front)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'license-front')}
                      className="hidden"
                      id="license-front"
                    />
                    <label
                      htmlFor="license-front"
                      className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-300 transition-colors"
                    >
                      Choose File
                    </label>
                    {uploadedFiles['license-front'] && (
                      <div className="flex items-center justify-center mt-2 text-green-400">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 mb-2">Upload Driver's License (Back)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'license-back')}
                      className="hidden"
                      id="license-back"
                    />
                    <label
                      htmlFor="license-back"
                      className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-300 transition-colors"
                    >
                      Choose File
                    </label>
                    {uploadedFiles['license-back'] && (
                      <div className="flex items-center justify-center mt-2 text-green-400">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default KYCPage;