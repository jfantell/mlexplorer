import requests
import json

'''
STEPS FOR USER

1. Sign up / Sign in
2. Create new model
3. Copy model id
4. Copy api key

'''


client_api_key = None
project_name = None
experiment_id = None

API_URL = "http://127.0.0.1:5000"

	'''
	Private functions
	'''
	@staticmethod
	def _save(client_api_key, experiment_id, project_name):
		MLToolKit.client_api_key = client_api_key
		MLToolKit.experiment_id = experiment_id
		MLToolKit.project_name = project_name

		# Print to terminal
		print(f"YOUR EXPERIMENT_ID IS: {experiment_id}")
		print(f"YOUR PROJECT NAME IS: {project_name}")

		# Write to file
		f = open('experiment.txt','w')
		f.write(f"YOUR EXPERIMENT_ID IS: {experiment_id}\n")
		f.write(f"YOUR PROJECT NAME IS: {project_name}\n")
		f.close()
	
	@staticmethod
	def _stringify_json(dict_):
		for key in dict_:
			dict_[key] = str(dict_[key])
		return dict_

	'''
	Purpose: Create a new experiment for a given model
	Return: Model Name, Model ID, Experiment ID
	'''
	@staticmethod
	def create_new_experiment(client_api_key, project_name):
		payload = {
			'project_name':project_name
		}
		headers = {"Authorization": f"Bearer {client_api_key}"}
		try:
			r = requests.post(url = MLToolKit.API_URL + "/experiments/api", json = payload, headers = headers)
			response = json.loads(r.text)
			experiment_id = response['experiment_id']
			MLToolKit._save(client_api_key, experiment_id, project_name)
			return experiment_id
		except:
			raise Exception("Unable to create new experiment...please check credentials and try again!")
	
	@staticmethod
	def clone_experiment(client_api_key, project_name, experiment_id, start_epoch):
		payload = {
			"project_name":project_name,
			"experiment_id":experiment_id,
			"start_epoch":start_epoch
		}
		headers = {"Authorization": f"Bearer {client_api_key}"}
		try:
			r = requests.post(url = MLToolKit.API_URL + "/experiments/clone/", json = payload, headers = headers)
			print(r.text,flush=True)
			response = json.loads(r.text)
			experiment_id = response['experiment_id']
			MLToolKit._save(client_api_key, experiment_id, project_name)
			return experiment_id
		except:
			raise Exception("Unable to clone experiment...please check credentials and try again!")

	'''
	Purpose: Add hyperparameter data to experiment
	'''
	@staticmethod
	def add_hyperparameters(hyperparameters_dict):
		# JSON cannot serialize FLOAT32, convert to string
		hyperparameters_dict = MLToolKit._stringify_json(hyperparameters_dict)
		headers = {"Authorization": f"Bearer {MLToolKit.client_api_key}"}
		try:
			r = requests.patch(url = MLToolKit.API_URL + f"/experiments/project/{MLToolKit.project_name}/id/{MLToolKit.experiment_id}/hyper", json = hyperparameters_dict, headers=headers)
			response = json.loads(r.text)
		except:
			raise Exception("Unable to add hyperparameters to experiment")
		

	'''
	Purpose: Add loss, accuracy, val_loss, val_accuracy to experiment
	'''
	@staticmethod
	def add_epoch_data(epoch_data_dict):
		# JSON cannot serialize FLOAT32, convert to string
		epoch_data_dict = MLToolKit._stringify_json(epoch_data_dict)
		headers = {"Authorization": f"Bearer {MLToolKit.client_api_key}"}
		try:
			r = requests.patch(url = MLToolKit.API_URL + f"/experiments/project/{MLToolKit.project_name}/id/{MLToolKit.experiment_id}/epoch", json = epoch_data_dict, headers=headers)
			response = json.loads(r.text)
		except:
			raise Exception("Unable to add epoch data to experiment")
			


	'''
	Purpose: Add metadata to experiment
	'''
	@staticmethod
	def add_metadata(metadata_dict):
		# JSON cannot serialize FLOAT32, convert to string
		metadata_dict = MLToolKit._stringify_json(metadata_dict)
		headers = {"Authorization": f"Bearer {MLToolKit.client_api_key}"}
		try:
			r = requests.patch(url = MLToolKit.API_URL + f"/experiments/project/{MLToolKit.project_name}/id/{MLToolKit.experiment_id}/meta", json = metadata_dict, headers=headers)
			response = json.loads(r.text)
		except:
			raise Exception("Unable to add metadata to experiment")

	
	'''
	Purpose: Add evaluation metrics to experiment
	'''
	@staticmethod
	def add_test_metrics(test_loss,test_accuracy):
		payload = {
			"test_loss":str(test_loss),
			"test_accuracy":str(test_accuracy)
		}
		headers = {"Authorization": f"Bearer {MLToolKit.client_api_key}"}
		try:
			r = requests.patch(url = MLToolKit.API_URL + f"/experiments/project/{MLToolKit.project_name}/id/{MLToolKit.experiment_id}/eval", json = payload, headers=headers)
			response = json.loads(r.text)
		except:
			raise Exception("Unable to add test data to experiment")
		

