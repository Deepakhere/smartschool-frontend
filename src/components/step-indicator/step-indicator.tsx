const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          1
        </div>
        <div className="w-24 h-1 bg-gray-200">
          <div
            className={`h-full ${
              currentStep === 2 ? "bg-indigo-600" : "bg-gray-200"
            }`}
            style={{ width: `${currentStep > 1 ? "100%" : "0%"}` }}
          ></div>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 2 ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          2
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
