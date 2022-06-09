import React, { useState, useEffect, FC } from 'react';
import '../Styles/Main.scss';
import Summary from './Summary';
import Loader from './Loader';
import Error from './Error';
import WeekChart from './WeekChart';
import MonthChart from './MonthChart';
import PackageInfo from './PackageInfo';
import Readme from './Readme';

interface MainProps {
  input: string;
}

const Main: FC<MainProps> = ({ input }) => {
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    error: false,
    errorMessage: '',
    errorCode: 200,
  });

  const fetchPackageInfo = async (input: string) => {
    setLoading(true);
    const response = await fetch(`/packages?package=${input}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();

    if (data.error) {
      setError({
        error: true,
        errorMessage: data.errorMessage,
        errorCode: data.errorCode,
      });
    }
    else {
      setPackageInfo(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackageInfo(input);
  }, [input]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="Main" id="Main">
          {error.error ? (
            <Error
              errorCode={error.errorCode}
              errorMessage={error.errorMessage}
            />
          ) : (
            <div className='main-container'>
              <div className="row">
                <Summary
                  heading={packageInfo.collected.metadata.name}
                  version={packageInfo.collected.metadata.version}
                  description={packageInfo.collected.metadata.description}
                  license={
                    packageInfo.collected.metadata.license
                      ? packageInfo.collected.metadata.license
                      : 'No license'
                  }
                  npm={packageInfo.collected.metadata.links.npm}
                  github={packageInfo.collected.metadata.links.repository}
                  downloads={Math.trunc(
                    packageInfo.evaluation.popularity.downloadsCount
                  ).toLocaleString()}
                  keywords={packageInfo.collected.metadata.keywords.join(', ')}
                />
                <WeekChart input={input} />
              </div>
              <div className="row1">
                <MonthChart input={input} />
                <PackageInfo
                  stars={packageInfo.collected.github.starsCount}
                  forks={packageInfo.collected.github.forksCount}
                  issues={packageInfo.collected.github.issues.openCount}
                  contributors={packageInfo.collected.github.contributors.length}
                  maintainers={packageInfo.collected.metadata.maintainers.length}
                />
              </div>
              <div className="row2">
                <Readme repo={packageInfo.collected.metadata.links.repository.split('/')[4]} owner={packageInfo.collected.metadata.links.repository.split('/')[3]} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Main;
