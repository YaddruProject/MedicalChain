import ContentLayout from '@components/ContentLayout';
import RecordList from '@components/RecordList';
import useUser from '@hooks/useUser';

const Records = () => {
  const user = useUser();
  return (
    <ContentLayout>
      <RecordList patientAddress={user.address} />
    </ContentLayout>
  );
};

export default Records;
