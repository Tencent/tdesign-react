export default function usePluginConfig(options, validate) {
  let pluginDefaultConfig = { ...options };
  const getConfig = (options) => {
    const currentOptions = { ...options };

    for (const i in currentOptions) {
      if (typeof currentOptions[i] === 'undefined') {
        delete currentOptions[i];
      }
    }

    return {
      ...pluginDefaultConfig,
      ...validate(currentOptions),
    };
  };

  return {
    getConfig,
    setGlobalConfig: (options) => {
      pluginDefaultConfig = {
        ...getConfig(options),
      };
    },
  };
}
