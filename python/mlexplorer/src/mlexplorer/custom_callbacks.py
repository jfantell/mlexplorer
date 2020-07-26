import tensorflow as tf

class ToolkitLog(tf.keras.callbacks.Callback):
	def on_epoch_end(self, epoch, logs={}):
		epoch_data = logs.copy()
		epoch_data['learning_rate'] = self.model.optimizer.lr.numpy()
		epoch_data['optimizer'] = self.model.optimizer.__class__.__name__
		MLToolKit.add_epoch_data(epoch_data)