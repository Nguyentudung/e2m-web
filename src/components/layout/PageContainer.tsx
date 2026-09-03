interface PageContainerProps {
  children: React.ReactNode;
}

function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

export default PageContainer;
