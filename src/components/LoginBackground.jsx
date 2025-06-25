function LoginBackground() {
  return (
    <>
      <div className="w-full h-screen absolute top-12 left-0 z-[-1]">
        {/* Black overlay layer */}
        <div className="absolute inset-0 bg-black/40"></div>
        <img
          src="background.jpg"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
}

export default LoginBackground;
