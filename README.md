# feathers-transport-mqtt
FeathersJS server-side MQTT transport adapter.

## Ideas
- Use an MQTT client that connects to a broker
- Host an MQTT broker and use an MQTT client that connects to that broker
- Handle request/response pattern using base MQTT topic, with requests in one sub-topic and responses in another (using QoS to ensure that topics without subscriptions are removed)
