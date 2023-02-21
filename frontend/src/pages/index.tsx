import { useTasks } from "../api/backendComponents";

function Index() {
  const { data, isLoading, error } = useTasks({});

  return (
    <div>
      Hello, world! <br />
      /Api/Task returned: {JSON.stringify(data, undefined, 2)}
    </div>
  );
}

export default Index;
