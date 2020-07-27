import tensorflow as tf
from .api import add_epoch_data

class LiveLogCallback(tf.keras.callbacks.Callback):
	def on_epoch_end(self, epoch, logs={}):
		epoch_data = logs.copy()
		epoch_data['learning_rate'] = self.model.optimizer.lr.numpy()
		epoch_data['optimizer'] = self.model.optimizer.__class__.__name__
		add_epoch_data(epoch_data)