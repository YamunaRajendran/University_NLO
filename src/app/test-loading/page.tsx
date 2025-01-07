async function getData() {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return { data: 'Content loaded!' };
}

export default async function TestLoading() {
  const data = await getData();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p>{data.data}</p>
    </div>
  );
}
